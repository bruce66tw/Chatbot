
var _json = {

    /**
     add json object into another object
     @param {object} source source object
     @param {object} target target object
     @return {object}
     */
    addJson: function (source, target) {
        if (!target)
            target = {};
        Object.keys(source).map(function (key, index) {
            target[key] = source[key];
        });
        return target;
    },

    /**
     convert keyValues to json object
     @param {array} keyValues keyValue array
     @param {string} keyId key field id, default to 'Key'
     @param {string} valueId value field id, default to 'Value'
     @return {object} 回傳的json的欄位名稱前面會加上'f'
     */
    keyValuesToJson: function (keyValues, keyId, valueId) {
        if (keyValues === null || keyValues.length === 0)
            return null;

        if (!keyId)
            keyId = 'Key';
        if (!valueId)
            valueId = 'Value';
        var data = {};
        for (var i=0; i<keyValues.length; i++) {
            var row = keyValues[i];
            data['f'+row[keyId]] = row[valueId];
        }
        return data;
    },

    //json: object or array
    toStr: function (json) {
        return (_json.isEmpty(json)) ? '' : JSON.stringify(json);
    },

    isEmpty: function (json) {
        return (json == null || $.isEmptyObject(json));
    },

    //convert url to json 
    urlToJson: function (url) {
        if (url.indexOf('?') > -1) {
            url = url.split('?')[1];
        }
        var pairs = url.split('&');
        var json = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            if (pair[0] !== "")
                json[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return json;
    },

    //convert string to json array
    strToArray: function (str) {
        return $.parseJSON(str);
    },

}; //class