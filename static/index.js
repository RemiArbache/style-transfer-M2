const contentReader  = new FileReader()
const styleReader = new FileReader()

// Output image size
const IMG_SIZE = 400

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

styleReader.onload = () =>{
    // Delete all previous croppers (empty div)
    var styleDiv = $("#croppieStyleDiv")
    styleDiv.empty()
    // Reacreate image tag
    styleDiv.append('<img id="uploadedStyleImage" src="" class="img-thumbnail"/>')

    // Set flag
    styleImageSet = true

    // Show preview
    const uploadedStyleImage = document.getElementById("uploadedStyleImage")
    uploadedStyleImage.src = styleReader.result

    // Create cropper bound to uploaded image
    var styleCroppie = $('#uploadedStyleImage')
    styleCroppie.croppie({
        viewport: {width: IMG_SIZE, height:IMG_SIZE, type:'square'},
        boundary: {width: IMG_SIZE, height:IMG_SIZE}
    })

    // Scroll to bottom
    window.scrollTo(0,document.body.scrollHeight)
    
    togglePredictButton()
}

// When the reader finishes converting the image to a data URI
contentReader.onload = () =>{
    // Delete all previous croppers (empty div)
    var contentDiv = $("#croppieContentDiv")
    contentDiv.empty()
    // Reacreate image tag
    contentDiv.append('<img id="uploadedContentImage" src="" class="img-thumbnail"/>')

    // Set flag
    contentImageSet = true
    
    // Show preview
    const uploadedContentImage = document.getElementById("uploadedContentImage")
    uploadedContentImage.src = contentReader.result
    
    // Create cropper bound to uploaded image
    var contentCroppie = $('#uploadedContentImage')
    contentCroppie.croppie({
        viewport: {width: IMG_SIZE, height:IMG_SIZE, type:'square'},
        boundary: {width: IMG_SIZE, height:IMG_SIZE}
    })

    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight)
    
    togglePredictButton()
}

// When content image is loaded
uploadContentImage.onchange = evt => {
    const [file] = uploadContentImage.files
    if (file) {
        // Convert to data URL 
        contentReader.readAsDataURL(file)
    }
}

// When style image is loaded
uploadStyleImage.onchange = evt => {
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
$(document).on('submit', '#predict-form', function(e)
        {
            // Disable default action when pressing the submit button
            e.preventDefault()
            
            // Sequentially get content and style URIs, then send ajax request
            var contentCroppie = $("#uploadedContentImage")

            // Content URI
            contentCroppie.croppie('result', 'base64').then((res)=>{
                contentURI = res
            }).then(() => {

                // Style URI
                var styleCroppie = $('#uploadedStyleImage')
                styleCroppie.croppie('result', 'base64').then((res)=>{
                    styleURI = res
                }).then(() => {

                    // Set submit button to loading and disabled
                    $('#spinner').addClass("spinner-border")
                    document.getElementById("submit-button").disabled = true
    
                    // Ajax POST request to '/' with content and style URIs
                    $.ajax({
                        type:'POST',
                        url:'/',
                        data: {
                            contenturi: contentURI,
                            styleuri: styleURI
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
            })            
        })
