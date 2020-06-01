let player = videojs("liveVideo");
player.play();
document.getElementById("selectServer").onchange = function () {
    player.dispose();
    setTimeout(function() { player = videojs("liveVideo") }, 1000);
};
