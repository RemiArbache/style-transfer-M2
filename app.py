from agent_lib import *

app = Flask(__name__)

@app.route("/",methods=['GET', 'POST'])
def index():
    if request.method == 'GET': 
        return render_template("index.html")

    # POST Request : 
    else:
        # Get content and style data URIs
        contentFile = request.form['contenturi']
        styleFile = request.form['styleuri']
        
        # Send to backend and get output Tensor
        outputs = transfer_style(contentFile, styleFile)
        stylized_image = outputs[0]

        # Convert to plot object
        im_plt = plt.imshow(stylized_image[0])
        # Scale 0-1 values to 0-255 and convert to uint8
        im_arr = (im_plt.get_array() * 255).astype(np.uint8)
        # Convert array to PIL format 
        pil_image = Image.fromarray(im_arr)

        # Save PIL image to bytesIO object
        img_io = BytesIO()
        pil_image.save(img_io, 'JPEG', quality=70)
        img_io.seek(0)
        
        # Encode image in base 64 (data URI format)
        output_s = img_io.read()
        b64 = base64.b64encode(output_s)

        # Fit returned data to src attribute of an HTML image tag
        res = 'data:image/png;base64,{0}'.format(b64.decode("utf-8"))
        return jsonify({'image_src': res})

if __name__ == '__main__':
    app.run()