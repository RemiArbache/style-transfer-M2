from agent_lib import *

app = Flask(__name__)


def serve_pil_image(pil_img):
    """Serves an image from a PIL variable"""
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

@app.route("/",methods=['GET', 'POST'])
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    """Get content- and style-images' URIs, feeds them to the model and serves the output"""
    if request.method == 'POST':
        contentFile = request.form['content-uri']
        styleFile = request.form['style-uri']
        
        outputs = transfer_style(contentFile, styleFile)
        
        stylized_image = outputs[0]

        # Convert to plot object
        im_plt = plt.imshow(stylized_image[0])
        # Scale 0-1 values to 0-255 and convert to uint8
        im_arr = (im_plt.get_array() * 255).astype(np.uint8)
        # Convert array to PIL format 
        pil_image = Image.fromarray(im_arr)

        return serve_pil_image(pil_image)

if __name__ == '__main__':
    app.run()