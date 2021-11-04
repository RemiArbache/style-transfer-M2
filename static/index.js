const contentReader  = new FileReader()
const styleReader = new FileReader()

// Output image size
const IMG_SIZE = 400

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

// When the reader finishes converting the image to a data URI
styleReader.onload = () =>{
    // Draw image on canvas
    var img = new Image()
    img.onload = () =>{
        styleCanvas.width = img.width
        styleCanvas.height = img.height
        styleCtx.drawImage(img,0,0,img.width,img.height)
    }
    img.src = styleReader.result

    // Set flag
    styleImageSet = true

    // Show preview
    uploadedStyleImage.src = styleReader.result

    // Scroll to bottom
    window.scrollTo(0,document.body.scrollHeight)
    
    togglePredictButton()
}

// When the reader finishes converting the image to a data URI
contentReader.onload = () =>{
    // Draw image on canvas
    var img = new Image()

    img.onload = () =>{
        contentCanvas.width = img.width
        contentCanvas.height = img.height
        contentCtx.drawImage(img,0,0,img.width,img.height)
    }
    img.src = contentReader.result

    // Set flag
    contentImageSet = true
    
    // Show preview
    uploadedContentImage.src = contentReader.result

    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight)
    
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

            // After image has finished loading, scroll to bottom
            setTimeout(() => {  window.scrollTo(0,document.body.scrollHeight) }, 100)
        }
    })
})