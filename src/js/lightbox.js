$.featherlightGallery.prototype.afterContent = function() {
    var caption = this.$currentTarget.parent().find('.boxText .flexCenterColumn h3').text();
    this.$instance.find('.caption').remove();
    $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
};