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
    if request.method == 'GET': 
        return render_template("index.html")
    else:
        contentFile = request.form['contenturi']
        styleFile = request.form['styleuri']
        
        outputs = transfer_style(contentFile, styleFile)
        
        stylized_image = outputs[0]

        # Convert to plot object
        im_plt = plt.imshow(stylized_image[0])
        # Scale 0-1 values to 0-255 and convert to uint8
        im_arr = (im_plt.get_array() * 255).astype(np.uint8)
        # Convert array to PIL format 
        pil_image = Image.fromarray(im_arr)

        img_io = BytesIO()
        pil_image.save(img_io, 'JPEG', quality=70)
        img_io.seek(0)
        
        output_s = img_io.read()
        b64 = base64.b64encode(output_s)

        res = 'data:image/png;base64,{0}'.format(b64.decode("utf-8"))
        
        return jsonify({'image_src': res})

if __name__ == '__main__':
    app.run()