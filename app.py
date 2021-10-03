import io
import json
import torchvision.transforms as transforms
import torchvision
import torch

from torchvision import models
from torchvision.utils import save_image
from d2l import torch as d2l
from torch import nn
from PIL import Image
from flask import Flask, jsonify, request, render_template, send_file
from io import BytesIO, StringIO


app = Flask(__name__)

style_layers, content_layers = [0, 5, 10, 19, 28], [25]
rgb_mean = torch.tensor([0.485, 0.456, 0.406])
rgb_std = torch.tensor([0.229, 0.224, 0.225])

pretrained_net = torchvision.models.vgg19(pretrained=True)
model = nn.Sequential(*[
    pretrained_net.features[i]
    for i in range(max(content_layers + style_layers) + 1)])

model.load_state_dict(torch.load('model_style_transfer.pth'))
style_img = d2l.Image.open('style_image.jpg')
device, image_shape = d2l.try_gpu(), (300, 450)

model.eval()

def preprocess(img, image_shape):
    transforms = torchvision.transforms.Compose([
        torchvision.transforms.Resize(image_shape),
        torchvision.transforms.ToTensor(),
        torchvision.transforms.Normalize(mean=rgb_mean, std=rgb_std)])
    return transforms(img).unsqueeze(0)

def postprocess(img):
    img = img[0].to(rgb_std.device)
    img = torch.clamp(img.permute(1, 2, 0) * rgb_std + rgb_mean, 0, 1)
    return torchvision.transforms.ToPILImage()(img.permute(2, 0, 1))

def get_contents(image_shape, device, content_img):
    content_X = preprocess(content_img, image_shape).to(device)
    contents_Y, _ = extract_features(content_X, content_layers, style_layers)
    return content_X, contents_Y

def get_styles(image_shape, device):
    style_X = preprocess(style_img, image_shape).to(device)
    _, styles_Y = extract_features(style_X, content_layers, style_layers)
    return style_X, styles_Y

def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

class SynthesizedImage(nn.Module):
    def __init__(self, img_shape, **kwargs):
        super(SynthesizedImage, self).__init__(**kwargs)
        self.weight = nn.Parameter(torch.rand(*img_shape))

    def forward(self):
        return self.weight

def get_inits(X, device, lr, styles_Y):
    gen_img = SynthesizedImage(X.shape).to(device)
    gen_img.weight.data.copy_(X.data)
    trainer = torch.optim.Adam(gen_img.parameters(), lr=lr)
    styles_Y_gram = [gram(Y) for Y in styles_Y]
    return gen_img(), styles_Y_gram, trainer

def gram(X):
    num_channels, n = X.shape[1], X.numel() // X.shape[1]
    X = X.reshape((num_channels, n))
    return torch.matmul(X, X.T) / (num_channels * n)

def extract_features(X, content_layers, style_layers):
    contents = []
    styles = []
    for i in range(len(model)):
        X = model[i](X)
        if i in style_layers:
            styles.append(X)
        if i in content_layers:
            contents.append(X)
    return contents, styles


def evaluate_network(X, contents_Y, styles_Y, device):
    model.eval()

    gen_img = SynthesizedImage(X.shape).to(device)
    gen_img.weight.data.copy_(X.data)
    X = gen_img()
    
    contents_Y_hat, styles_Y_hat = extract_features(X, content_layers, style_layers)

    return X

@app.route("/",methods=['GET', 'POST'])
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        image = d2l.Image.open(file)
        
        content_X, contents_Y = get_contents(image_shape, device, image)
        _, styles_Y = get_styles(image_shape, device)

        predicted_image_tensor = evaluate_network(content_X, contents_Y, styles_Y, device)
        return serve_pil_image(postprocess(predicted_image_tensor))

if __name__ == '__main__':
    app.run()