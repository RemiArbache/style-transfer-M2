const contentReader  = new FileReader();
const styleReader = new FileReader();


// Image files
const uploadedContentImage = document.getElementById("uploadedContentImage")
const uploadedStyleImage = document.getElementById("uploadedStyleImage")

// File inputs
const uploadContentImage = document.getElementById("uploadContentImage")
const uploadStyleImage = document.getElementById("uploadStyleImage")

// Flags used for predict button 
var contentImageSet = styleImageSet = false

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

// When the reader finishes converting the image to a data URI
contentReader.onload = () =>{
    // Set form input value to data URI
    document.getElementById('contentURI').value = contentReader.result
    
    // Set flag
    contentImageSet = true
    
    // Show preview
    uploadedContentImage.src = contentURI
    
    // Scroll to bottom
    window.scrollTo(0,document.body.scrollHeight);
    
    togglePredictButton()
}

styleReader.onload = () =>{
    // Set form input value to data URI
    document.getElementById('styleURI').value = styleReader.result
    
    // Set flag
    styleImageSet = true
    
    // Show preview
    uploadedStyleImage.src = styleURI 
    
    // Scroll to bottom
    window.scrollTo(0,document.body.scrollHeight);
    
    togglePredictButton()
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
$(document).on('submit','#predict-form',function(e)
        {
            // Disable default action when pressing the submit button
            e.preventDefault();

            // Set submit button to loading and disabled
            $('#spinner').addClass("spinner-border")
            document.getElementById("submit-button").disabled = true

            // Ajax POST request to '/' with content and style URIs
            $.ajax({
                type:'POST',
                url:'/',
                data: {
                    contenturi: $('#contentURI').val(),
                    styleuri: $('#styleURI').val()
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
                    setTimeout(() => {  window.scrollTo(0,document.body.scrollHeight); }, 100);
                }
            })
        });
