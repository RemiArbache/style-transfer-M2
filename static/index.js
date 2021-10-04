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
    togglePredictButton()
}

styleReader.onload = () =>{
    styleURI = styleReader.result
    document.getElementById('styleURI').value = styleURI
    styleImageSet = true
    uploadedStyleImage.src = styleURI 
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
