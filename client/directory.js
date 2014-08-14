//$(event.currentTarget).data('layer')

Template.directory.events({
    'click .poemSectionLink': function(event){
        Router.go('/poem/' + this.poemID);
    },
})