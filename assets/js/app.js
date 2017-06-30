var app, map, data;

(function() {
    data = {
        modes: modes, //Loaded from /data/modes.js in index.html
        mode: false,
        loading: false,
        done: false,
        areas: {},
        correct: {},
        alternatives: [],
        current: {
            feature: null,
            layer: null
        },
        score: {
            user: 0,
            current: 0,
            total: 0
        }
    };

    app = new Vue({
        el: '#app',
        data: data,
        mounted: function() {

        },
        methods: {
            setMode: function(index) {
                this.loading = true;
                this.mode = modes[index];
                this.fetchAreas();

                map.options.maxZoom = this.mode.hasOwnProperty('maxZoom') ? this.mode.maxZoom : 6;
            },
            fetchAreas: function() {
                var self = this;

                axios.get(this.mode.data_url + this.mode.data_file).then(function(d) {
                    self.areas = d.data;

                    var totalScore = self.areas.features.length * 50;
                    self.score.total = totalScore;
                    self.score.current = totalScore;

                    self.areas['used'] = [];
                    Vue.nextTick(function() {
                        self.pollArea();
                        self.loading = false;
                    });
                })
            },
            checkAnswer: function(index) {
                this.alternatives[index].hasClicked = true;

                if (this.alternatives[index].correct) {
                    var self = this;

                    self.current.layer.setStyle(map_style.success);
                    self.score.user += self.score.current;

                    setTimeout(function() {
                        if (self.areas.features.length > self.areas.used.length) {
                            self.pollArea();
                        } else {
                            self.done = true;
                        }

                    }, 200);
                } else {
                    this.score.current -= 10;
                }
            },
            pollArea: function() {
                var feature = this.random(this.areas.features);
                var key = feature.properties[this.mode.key];
                var isUsed = this.areas.used.indexOf(feature.properties[this.mode.key]) > -1;

                if (isUsed) {
                    this.pollArea();
                } else {
                    this.score.current = 50;
                    this.current.feature = feature;
                    this.current.imageURI = this.mode.image_pattern(this.mode.data_url, feature);
                    this.areas.used.push(key);
                    this.plot_to_map();

                    var alternatives = [{
                        text: (typeof this.mode.label === "function") ? this.mode.label(feature) : key,
                        correct: true,
                        hasClicked: false
                    }];

                    var decoy_keys = [key];
                    while (alternatives.length < 5) {
                        var decoy = this.random(this.areas.features);
                        if (decoy_keys.indexOf(decoy.properties[this.mode.key]) < 0) {
                            decoy_keys.push(decoy.properties[this.mode.key]);

                            alternatives.push({
                                text: (typeof this.mode.label === "function") ? this.mode.label(decoy) : decoy.properties[this.mode.label],
                                correct: false,
                                hasClicked: false
                            });
                        }
                    }

                    this.alternatives = this.shuffleArray(alternatives);
                }
            },
            plot_to_map: function() {
                this.current.layer = L.geoJson(this.current.feature, {
                    style: map_style.highlight
                });
                map.addLayer(this.current.layer);
                map.fitBounds(this.current.layer.getBounds());

            },
            random: function(obj, len, not) {
                len = len || 1;
                not = not || [];
                not = (not instanceof Array ? not : [not]);

                if (obj.length > not.length) {
                    var ret = [];
                    for (i = 0; i < len; i++) {
                        var ran = obj[Math.floor(Math.random() * obj.length)];
                        while (not.indexOf(ran) > -1 && ret.indexOf(ran) > -1) {
                            ran = (obj[Math.floor(Math.random() * obj.length)]);
                        }
                        ret.push(ran);
                    }
                    return (ret.length == 1 ? ret[0] : ret);
                } else {
                    return false;
                }
            },
            shuffleArray: function(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            },
            resetPage: function() {
                location.reload();
            }
        }
    });

    map = L.map('map', {
            maxZoom: 6
        })
        .addLayer(L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        }))
        .on('load', function() {

        })
        .setView([0, 0], 1);

}).call(this);

var map_style = {
    default: {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 0.65
    },
    highlight: {
        "color": "#FF3300",
        "weight": 1,
        "opacity": 0.9
    },
    success: {
        "color": "#00ff00",
        "weight": 1,
        "opacity": 0.65
    },
    fail: {
        "color": "#ff0000",
        "weight": 1,
        "opacity": 0.65
    }
};