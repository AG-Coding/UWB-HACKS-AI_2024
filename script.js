function openTab(evt, tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
  }
  
  document.getElementById("Tab1").style.display = "block";
  document.getElementsByClassName("tablinks")[0].classList.add("active");
  