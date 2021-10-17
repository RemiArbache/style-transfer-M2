var contentReader  = new FileReader();
var styleReader = new FileReader();
var contentURI, styleURI;

uploadedContentImage = document.getElementById("uploadedContentImage")
uploadedStyleImage = document.getElementById("uploadedStyleImage")

var uploadContentImage = document.getElementById("uploadContentImage")
var uploadStyleImage = document.getElementById("uploadStyleImage")


contentReader.onload = () =>{
    contentURI = contentReader.result
    document.getElementById('contentURI').value = contentURI
    contentImageSet = true
    uploadedContentImage.src = contentURI
    window.scrollTo(0,document.body.scrollHeight);
    togglePredictButton()
}

styleReader.onload = () =>{
    styleURI = styleReader.result
    document.getElementById('styleURI').value = styleURI
    styleImageSet = true
    uploadedStyleImage.src = styleURI 
    window.scrollTo(0,document.body.scrollHeight);
    togglePredictButton()
}

var contentImageSet = styleImageSet = false

uploadContentImage.onchange = evt => {
    const [file] = uploadContentImage.files
    if (file) {
        contentReader.readAsDataURL(file)
    }
}

uploadStyleImage.onchange = evt => {
    const [file] = uploadStyleImage.files
    if (file) {
        styleReader.readAsDataURL(file)
    }
}

togglePredictButton = () => {
    if (contentImageSet && styleImageSet){
        document.getElementById("submit-button").disabled = false
    }
    else{
        document.getElementById("submit-button").disabled = true
    }
}

$(document).on('submit','#predict-form',function(e)
        {
            e.preventDefault();
            $('#spinner').addClass("spinner-border")
        
            document.getElementById("submit-button").disabled = true
            $.ajax({
                type:'POST',
                url:'/',
                data: {
                    contenturi: $('#contentURI').val(),
                    styleuri: $('#styleURI').val()
                },
                success:function(res)
                {
                    $('#resultImage').attr('src',res.image_src)
                    $('#spinner').removeClass("spinner-border")
                    document.getElementById("submit-button").disabled = false
                    setTimeout(() => {  window.scrollTo(0,document.body.scrollHeight); }, 200);
                    
                }
            })
        });
