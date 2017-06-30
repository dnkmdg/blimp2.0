var modes = [{
        data_url: 'data/modes/kommuner/',
        data_file: 'kommuner.json',
        image_pattern: function(url, feature) {
            return url + feature.properties.short_name + '_vapen.svg';
        },
        title: 'Svenska kommuner',
        key: 'name',
        maxZoom: 8,
        label: 'name'
    }, {
        data_url: 'data/modes/svenska_landskap/',
        data_file: 'svenska_landskap.json',
        image_pattern: function(url, feature) {
            return url + feature.properties.landskap + '_vapen.svg';
        },
        title: 'Svenska Landskap',
        key: 'landskap',
        label: 'landskap'
    },
    {
        data_url: 'data/modes/europe/',
        data_file: 'europe.json',
        image_pattern: function(url, feature) {
            return url + feature.properties.ISO2 + '.svg'
        },
        title: 'Europa',
        key: 'NAME',
        maxZoom: 8,
        label: 'NAME'
    },
    {
        data_url: 'data/modes/capitals/',
        data_file: 'capitals.json',
        image_pattern: function(url, feature) {
            //return url + feature.properties.cca3 + '.svg'
            return '';
        },
        title: 'Huvudstäder',
        key: 'name:sv',
        label: function(feature) {
            return feature.properties['name:sv'] + ', ' + feature.properties['is_in:country']
        }
    },
    {
        data_url: 'data/modes/countries/',
        data_file: 'countries.json',
        image_pattern: function(url, feature) {
            return url + feature.properties.cca3 + '.svg'
        },
        title: 'Världens länder',
        key: 'name',
        label: 'name'
    },
    {
        data_url: 'data/modes/us_states/',
        data_file: 'us_states.json',
        image_pattern: function(url, feature) {
            //return url + feature.properties.cca3 + '.svg'
            return '';
        },
        title: 'US States',
        key: 'NAME',
        label: 'NAME'
    }

]