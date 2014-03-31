/*global define:true*/

/**
 * Layout for the edit panel, plus selected entity overlays.
 */
define([
    'backbone.marionette',
    'communicator',
    'jquery',
    'views/editor/controls_view',
    'views/editor/tabs_view',
    'views/editor/methods_sidebar_view',
    'views/editor/methods_details_view',
    'views/editor/properties_details_view',
    'views/editor/events_details_view',
    'views/editor/events_binding_view',
    'views/editor/events_sidebar_view',
    'hbs!tmpl/layout/editor_template'
], function(
    Marionette,
    Communicator,
    $,
    ControlsView,
    TabsView,
    MethodsSidebarView,
    MethodsDetailsView,
    PropertiesDetailsView,
    EventsDetailsView,
    EventsBindingView,
    EventsSidebarView,
    editorTemplate
) {

    'use strict';

    var EditorLayout;

    EditorLayout = Marionette.Layout.extend({

        template: {
            type: 'handlebars',
            template: editorTemplate
        },

        regions: {
            controls: '.controls',
            tabs: '.tabs-container',
            panels: '.panels',
            methods: '.methods',
            details: '.details',
            events: '.events',
            selectedEntity: '#selected-entity'
        },

        ui: {
            panel: '#edit-panel'
        },

        initialize: function() {

            this.animationTimeout = 350;
            this.project = Communicator.reqres.request('project');
            this.ideModel = Communicator.reqres.request( 'ide:model');

        },

        onShow: function() {
            var project = this.project,
                tabsView = new TabsView({ model: project });

            Communicator.mediator.on('tab:select', this.onTabSelect, this);
            Communicator.mediator.on('method:selected', this.onMethodSelected, this);
            Communicator.mediator.on('event:selected', this.onEventSelected, this);
            Communicator.mediator.on('entity:selected', this.onEntitySelected, this);

            this.controls.show( new ControlsView({ model: this.project }) );
            this.tabs.show( tabsView );

            if( this.project.isLoaded() ) {
                this.onProjectLoaded();
            } else {
                Communicator.mediator.on('project:loaded', this.onProjectLoaded, this);
            }

        },

        onClose: function() {

            Communicator.mediator.off('tab:select', this.onTabSelect, this);
            Communicator.mediator.off('method:selected', this.onMethodSelected, this);
            Communicator.mediator.off('event:selected', this.onEventSelected, this);
            Communicator.mediator.off('entity:selected', this.onEntitySelected, this);
            Communicator.mediator.off('project:loaded', this.onProjectLoaded, this);

        },

        onProjectLoaded: function() {

            var selectedEntityId = this.ideModel.getSelectedEntityId();

            this.entity = this.project.getEntity( selectedEntityId );

            this.showEntityViews();

        },

        showEntityViews: function() {

            this.methods.show( new MethodsSidebarView({ model: this.entity }) );
            this.events.show( new EventsSidebarView({ model: this.entity }) );
            this.onTabSelect('properties');

        },

        onEntitySelected: function( selectedEntityId ) {

            this.entity = this.project.getEntity( selectedEntityId );
            this.showEntityViews();

        },

        onMethodSelected: function() {
            this.onTabSelect('methods');
        },

        onEventSelected: function() {
            this.onTabSelect( 'events' );
        },

        onTabSelect: function( tab ) {

            this.highlightTab( tab );
            this.highlightSidePanel( tab );
            this.details.show( this.detailsView( tab ) );

        },

        /**
         * TODO we shouldn't recreate these every time you change tabs - if we are on the same entity
         * and we have already created this tab view, then re-use it.
         */
        detailsView: function( tab ) {
            var selectedEventName,
                detailsView;

            switch( tab ) {

                case 'methods':
                    detailsView = new MethodsDetailsView({model: this.entity});
                    break;

                case 'events':

                    selectedEventName = this.ideModel.getSelectedEventName();

                    if( selectedEventName ) {
                        detailsView = new EventsBindingView({model: this.entity});
                    } else {
                        detailsView = new EventsDetailsView({model: this.entity});
                    }

                    break;

                default:
                    detailsView = new PropertiesDetailsView({model: this.entity});
                    break;
            }

            return detailsView;
        },

        // FIXME This should be in the View, not the Layout?
        highlightTab: function(tabName) {

            $('dd', this.tabs.$el).removeClass('active');
            $('a[href="#panel-'+tabName+'"]', this.tabs.$el).parent().addClass('active');

        },

        // FIXME This should be in the View, not the Layout?
        highlightSidePanel: function(tabName) {

            $('.side-panel', this.panels.$el).removeClass('active');
            $('.'+tabName+' .side-panel', this.panels.$el).addClass('active');

        },

        animateClose: function(callback) {

            if( this.ui.panel.removeClass ) {

                this.ui.panel.removeClass('animate-open');
                $('body').addClass('no-edit-panel');

                if( callback ) {
                    setTimeout(callback, this.animationTimeout);
                }
            }

        },

        animateOpen: function(callback) {

            this.ui.panel.addClass('animate-open');
            $('body').removeClass('no-edit-panel');

            if( callback ) {
                setTimeout(callback, this.animationTimeout);
            }

        }

    });

    return EditorLayout;

});
