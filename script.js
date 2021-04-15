const small_film_set = [
    { title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
    { title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
    { title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
    { title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
    { title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
    { title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}
];

webix.protoUI({
    name:"mybutton",
    $init: function (config) {
        config.value = config.states[0],
        webix.html.addCss( this.$view, "off");
        this.attachEvent("onItemClick", function(){
            this.config.state++;

            if (this.config.state === 3) {
                this.config.state = 0;
            }

            if (this.config.state === 0) {
                webix.html.removeCss( this.$view, "sortDesc");
                webix.html.addCss( this.$view, "off");
            }
            if (this.config.state === 1) {
                webix.html.removeCss( this.$view, "off");
                webix.html.addCss( this.$view, "sortAsc");
            }
            if (this.config.state === 2) {
                webix.html.removeCss( this.$view, "sortAsc");
                webix.html.addCss( this.$view, "sortDesc");
            }

            this.config.value = this.config.states[this.config.state];
            this.refresh();
            this.callEvent("onStateChange", [this.config.state]);
        })
    },  
}, webix.ui.button);

webix.protoUI({
    name: "myform",
    $init: function (config) {
        const elements = [];
        for (let i = 0; i < config.fields.length; i++) {
            if (elements.find(item => item.name === config.fields[i].toLowerCase())) {
                webix.message("Please, add non-repeating fields in the form");
            } else {
                elements.push({
                    view: "text",
                    label: config.fields[i],
                    name: config.fields[i].toLowerCase()
                });
            }
        }
        elements.push({
            cols: [{
                view: "button",
                value: "Cancel",
                click: config.cancelAction || this.defaults.cancelAction
            },
            {},
            {
                view: "button",
                value: "Save",
                css: "webix_primary",
                click: config.saveAction ||  this.defaults.saveAction
            }
            ]
        });
        config.elements = elements;
    },

    defaults: {
        saveAction: function() {
            webix.message("default Save");
        },
        cancelAction: function() {
            this.getParentView().getParentView().clear();
        }
    },
}, webix.ui.form);

const listView = {
    rows:[
        {
            view: "mybutton",
            states: {0: "Off", 1: "Sort Asc", 2: "Sort Desc"}, 
            state: 0,
            id: "mybutton",
            on:{
                onStateChange:function(state){
                    if (state === 0) {
                        $$("filmsList").sort("#rank#");
                    }

                    if (state === 1) {
                        $$("filmsList").sort("#year#", "asc");
                    }

                    if (state === 2) {
                        $$("filmsList").sort("#year#", "desc");
                    }
                }
            } 
        },
        {
            view: "list",
            id: "filmsList",
            autoheight: true,
            select: true,
            template: "<b>#rank#. #title#</b>, year:#year#, rank:#rank#",
            data: small_film_set,
        },
    ],
}

const form = {
    view: "myform",
    id: "myForm",
    fields: ["Fname", "Lname", "Address"],
    saveAction: function() {
        const formValues = $$("myForm").getValues();
        for (key in formValues) {
            webix.message(formValues[key])
        }
    },
}

webix.ui({
    rows:[
        listView,
        form
    ]
}); 
