const token = document.cookie;
const parseJwt = (token) => {
  try {
    let authorName = document.getElementById("aName");
    let authorImage = document.getElementById("aImage");
    let authorTitle = document.getElementsByClassName("blog-title");
    const key = JSON.parse(atob(token.split(".")[1]));
    authorName.innerHTML = key.user.nombre + " " + key.user.apellido;
    authorImage.src = key.user.pfp;
    authorTitle.innerHTML = key.user.blog_name;
    console.log(key.user);
  } catch (e) {
    console.log(e);
  }
};

parseJwt(token);
