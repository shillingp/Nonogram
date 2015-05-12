/*jshint browser: true*/

var isMobile = new function() {
    var uA = navigator.userAgent;
    
    this.Android = !!uA.match(/Android/i);
    this.BlackBerry = !!uA.match(/BlackBerry/i);
    this.iOS = !!uA.match(/iPhone|iPad|iPod/i);
    this.Opera = !!uA.match(/Opera Mini/i);
    this.Windows = !!uA.match(/IEMobile/i);
    
    this.any = (this.Android || this.BlackBerry || this.iOS || this.Opera || this.Windows);
}();