const contentReader  = new FileReader()
const styleReader = new FileReader()

// Output image size
const IMG_SIZE = 400

// Result image
const resultImage = document.getElementById("resultImage")

// Content Canvas
const contentCanvas = document.getElementById("contentCanvas")
const contentCtx = contentCanvas.getContext("2d")

// Style Canvas
const styleCanvas = document.getElementById("styleCanvas")
const styleCtx = styleCanvas.getContext("2d")

// Image files
const uploadedContentImage = document.getElementById("uploadedContentImage")
const uploadedStyleImage = document.getElementById("uploadedStyleImage")

// File inputs
const uploadContentImage = document.getElementById("uploadContentImage")
const uploadStyleImage = document.getElementById("uploadStyleImage")

// Image URIs
var contentURI, styleURI

// Flags used for predict button 
var contentImageSet = styleImageSet = false

// Toggle predict button on page refresh
window.onload = () => {
    togglePredictButton()
}

// Resize and canvas - keep aspect ratio
function resizeImage(img, canvas){
    if (img.width > img.height){
        canvas.width = IMG_SIZE
        canvas.height = IMG_SIZE * img.height / img.width
    } else {
        canvas.height = IMG_SIZE
        canvas.width = IMG_SIZE * img.width / img.height
    }
}

// When the reader finishes converting the image to a data URI
styleReader.onload = () =>{
    // Draw image on canvas
    var img = new Image()
    img.onload = () =>{
        // Resize image keep aspect ratio
        resizeImage(img, styleCanvas)

        // Draw image on canvas
        styleCtx.drawImage(img,0,0,styleCanvas.width,styleCanvas.height)
    }
    img.src = styleReader.result

    // Set flag
    styleImageSet = true

    // Show preview
    uploadedStyleImage.src = styleReader.result
    
    togglePredictButton()
}

// When the reader finishes converting the image to a data URI
contentReader.onload = () =>{
    // Draw image on canvas
    var img = new Image()

    img.onload = () =>{
        // Resize image keep aspect ratio
        resizeImage(img, contentCanvas)

        // Draw image on canvas
        contentCtx.drawImage(img,0,0,contentCanvas.width,contentCanvas.height)
    }
    img.src = contentReader.result

    // Set flag
    contentImageSet = true
    
    // Show preview
    uploadedContentImage.src = contentReader.result

    togglePredictButton()
}

// When content image is loaded
uploadContentImage.onchange = () => {
    const [file] = uploadContentImage.files
    if (file) {
        // Convert to data URL 
        contentReader.readAsDataURL(file)
    }
}

// When style image is loaded
uploadStyleImage.onchange = () => {
    const [file] = uploadStyleImage.files
    if (file) {
        // Convert to data URL
        styleReader.readAsDataURL(file)
    }
}

// When result image is loaded
resultImage.onload = () => {
    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight)
}

// Only allow prediction if both images are set
togglePredictButton = () => {
    if (contentImageSet && styleImageSet){
        document.getElementById("submit-button").disabled = false
    }
    else{
        document.getElementById("submit-button").disabled = true
    }
}

// Ajax request for form submission
$(document).on('submit', '#predict-form', function(e){
    // Disable default action when pressing the submit button
    e.preventDefault()
    
    // Set submit button to loading and disabled
    $('#spinner').addClass("spinner-border")
    document.getElementById("submit-button").disabled = true

    $.ajax({
        url: '/',
        type: 'POST',
        data:{
            contenturi: contentCanvas.toDataURL(),
            styleuri: styleCanvas.toDataURL()
        },
        // On response success
        success:function(res)
        {
            // Show result image 
            $('#resultImage').attr('src',res.image_src)
            
            // Set submit button to ready and enabled
            $('#spinner').removeClass("spinner-border")
            document.getElementById("submit-button").disabled = false
        }
    })
})