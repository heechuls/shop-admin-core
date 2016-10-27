var GLOBALS = {
    TAB_USER : 0,
    TAB_PRODUCT : 1,
    TAB_REFERRAL : 2,

    TOOL_FEATURE_QUALITY : 1,
    TOOL_FEATURE_REVIEW : 2,
    TOOL_FEATURE_PRICE : 4,
    TOOL_FEATURE_SAFETY : 8,

    TOOL_FEATURES : new Array(1, 2, 4, 8),

    API_HOME : '/apis/',

    getListToolFeatures : function(feature_flag){
        var retVal = "";
        retVal += (feature_flag & this.TOOL_FEATURE_QUALITY) == this.TOOL_FEATURE_QUALITY ? "품질 " : "";
        retVal += (feature_flag & this.TOOL_FEATURE_REVIEW) == this.TOOL_FEATURE_REVIEW ? "리뷰 " : "";
        retVal += (feature_flag & this.TOOL_FEATURE_PRICE) == this.TOOL_FEATURE_PRICE ? "가격 " : "";
        retVal += (feature_flag & this.TOOL_FEATURE_SAFETY) == this.TOOL_FEATURE_SAFETY ? "안전" : "";
        
        return retVal;
    },

    NURIBOX_NOT_OWN_AND_NEED : 0,
    NURIBOX_OWN : 1,
    NURIBOX_NEED : 2,


};

/*
var val = 0;
val |= GLOBALS.TOOL_FEATURE_QUALITY;
val |= GLOBALS.TOOL_FEATURE_PRICE;

console.log(GLOBALS.getListToolFeatures(val));
*/

exports.GLOBALS = GLOBALS;