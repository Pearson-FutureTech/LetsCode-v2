/*global define:true*/
/*jshint camelcase:false*/

/**
 * Page for listing users' projects.
 */
define([
    'underscore',
    'jquery',
    'communicator',
    'backbone',
    'views/base_page_view',
    'hbs!tmpl/view/projects_tmpl'
], function(
    _,
    $,
    Communicator,
    Backbone,
    BasePageView,
    ProjectsTmpl
) {

    'use strict';

    return BasePageView.extend({

        initialize: function() {
            _.bindAll(
                this,
                'onClickRow',
                'onClickOpen'
            );

        },

        template: {
            type: 'handlebars',
            template: ProjectsTmpl
        },

        events: {
            'click .row': 'onClickRow',
            'click [data-action="open"]': 'onClickOpen',
            'click [data-action="delete"]': 'onClickDelete',
            'click [data-action="confirmDelete"]': 'onClickDeleteConfirm',
            'click [data-action="cancelDelete"]' : 'onClickDeleteCancel',
            'click a[data-clientside="true"]': 'onClickClientSideLink'
        },

        onClickRow: function(e) {

            this.$el.find('item.selected').removeClass('selected');

            var $thisItem = $(e.currentTarget).parents('.item');

            $thisItem.toggleClass('selected');

        },

        onClickOpen: function(e) {

            var projectId = $(e.currentTarget).attr('data-projectId');

            e.preventDefault();

            Communicator.mediator.trigger('project:open', projectId);

        },

        onClickDelete: function(e) {

            var $linkEl = $(e.currentTarget),
                projectId = $linkEl.attr('data-projectId'),
                $popupEl = $('#popup-confirm-delete');

            e.preventDefault();

            $('[data-action=confirmDelete]', $popupEl).data('projectId', projectId);

            $popupEl.addClass('open');

        },

        onClickDeleteConfirm: function(e) {

            var $linkEl = $(e.currentTarget),
                projectId = $linkEl.data('projectId');

            $('#popup-confirm-delete').removeClass('open');

            Communicator.mediator.trigger('project:delete', projectId);

            // Optimistically remove from the list
            $('[data-projectId='+projectId+']').parents('div.item').fadeOut(function() {
                $(this).remove();
            });

        },

        onClickDeleteCancel: function() {

            $('#popup-confirm-delete').removeClass('open');

        },

        // Prevent request going to server - we can handle this on the client
        onClickClientSideLink: function(e) {

            e.preventDefault();

            var href = $(e.currentTarget).attr('href');
            Backbone.history.navigate(href, {trigger: true});

        },

        serializeData: function() {

            var user = this.model.user;

            return {
                user: user.toJSON()
            };
        }

    });

});
