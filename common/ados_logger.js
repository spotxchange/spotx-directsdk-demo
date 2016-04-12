var AdOSLogger = function (jQuery, container, directAdOS) {
    this._jQuery = jQuery;
    var $logger = jQuery("<div/>", {id: "ados-logger-events-list"});
    this._eventsList = jQuery("<ul/>");
    this._lastEvent = null;
    this._eventsSlots = {};
    jQuery("<h4>&nbsp;Direct AdOS Events:</h4>").appendTo(jQuery($logger));
    this._eventsList.appendTo($logger);
    $(container).append($logger);
    directAdOS.eachEvent(function (eventId, eventName) {
        directAdOS.subscribe(this._onDirectAdOSEvent.bind(this, eventName), eventId);
    }, this);
}

AdOSLogger.prototype._onDirectAdOSEvent = function (eventName) {
    if (!this._eventsSlots[eventName]) {
        this._eventsSlots[eventName] = this._jQuery("<li>" + eventName + "</li>");
        this._eventsSlots[eventName].appendTo(this._eventsList);
    }
    if (this._lastEvent) {
        this._lastEvent.removeClass(AdOSLogger.LAST_EVENT_CLASS);
    }
    this._lastEvent = this._eventsSlots[eventName];
    this._lastEvent.addClass(AdOSLogger.LAST_EVENT_CLASS);
};

AdOSLogger.LAST_EVENT_CLASS = "last";
