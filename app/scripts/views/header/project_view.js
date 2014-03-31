/*global define*/

/**
 * For the header, when we're displaying a project.
 */
define([
    'jquery',
    'backbone.marionette',
    'underscore',
    'communicator',
    'zeroclipboard',
    'modules/project_module',
    'hbs!tmpl/view/header/project_template',
    'foundation',
    'foundation.dropdown'
], function(
    $,
    Marionette,
    _,
    Communicator,
    ZeroClipboard,
    ProjectModule,
    projectTemplate
) {

    'use strict';


    /**
     * Wrapper around the test to see if editing is currently enabled
     */
    function isEditAllowed() {
        return Communicator.reqres.request('ide:model').get('allowEdit');
    }

    return Marionette.ItemView.extend({

        template: {
            type: 'handlebars',
            template: projectTemplate
        },

        ui: {
            editButton: '[data-control="edit"]',
            playButton: '[data-control="play"]',
            projectPopup: '#project-drop',
            projectPopupScreens: '#project-drop .popup-screen',
            copiedMessage: '.copied',
            projectName: '#project-name',
            saveAsConfirmButton: '[data-control="save-as-confirm"]'
        },

        events: {
            'click [data-control="edit"]': 'onClickEditMode',
            'click [data-control="play"]': 'onClickPlayMode',
            'click [data-control="undo"]': 'onClickUndo',
            'click [data-control="redo"]': 'onClickRedo',
            'click [data-dropdown="project-drop"]': 'onClickProject',
            'click [data-control="share"]': 'onClickShare',
            'click [data-control="save-as"]': 'onClickSaveAs',
            'click [data-control="save-as-confirm"]': 'onClickSaveAsConfirm',
            'click [data-control="close"]': 'onClickClose',
            'keydown #project-name': 'onChangeProjectName',
            'change #project-name': 'onChangeProjectName'
        },

        initialize: function(options) {
            this.isFlashEnabled = options.isFlashEnabled;

            _.bindAll(
                this,
                'onCopyComplete',
                'onSaveAsSuccess',
                'onSaveAsError'
            );
        },

        onShow: function() {

            if (this.isFlashEnabled) {
                this.clip = this.createZeroClipboard($('#copy-project-url'));
                this.clip.on('complete', this.onCopyComplete);
            }

            // Foundation JavaScript hook for the popup
            $(document).foundation();
        },

        onClose: function() {

            // Switch off event listener or it would break next time
            if( this.clip ) {
                this.clip.off('complete', this.onCopyComplete);
            }

        },

        serializeData: function() {
            return {
                projectName: this.model.get('name'),
                projectURL: this.model.getShareUrl(),
                isFlashEnabled: this.isFlashEnabled
            };
        },

        onClickUndo: function(e) {
            e.preventDefault();
            this.model.undo();
            Communicator.mediator.trigger('ide:action:undo');
        },

        onClickRedo: function(e) {
            e.preventDefault();
            this.model.redo();
            Communicator.mediator.trigger('ide:action:redo');
        },

        onClickEditMode: function(e) {
            e.preventDefault();
            if (!isEditAllowed()) {
                this.ui.playButton.addClass('inactive');
                this.ui.editButton.removeClass('inactive');
                Communicator.mediator.trigger('ide:mode:edit');
            }
        },

        onClickPlayMode: function(e) {
            e.preventDefault();
            this.ui.editButton.addClass('inactive');
            this.ui.playButton.removeClass('inactive');
            Communicator.mediator.trigger('ide:mode:play');
        },

        /**
         * Sets up ZeroClipboard to enable cross browers copy to clipboard
         */
        createZeroClipboard: function(el) {
            ZeroClipboard.setDefaults({
                moviePath: '/bower_components/zeroclipboard/ZeroClipboard.swf'
            });
            return new ZeroClipboard(el);
        },

        onClickProject: function() {
            // Just reset the popup screen - our customised Foundation dropdown plugin will take care of the rest
            this.showProjectPopupScreen('project');
            this.ui.copiedMessage.css('visibility', 'hidden');
        },

        onClickShare: function() {
            this.showProjectPopupScreen('share');
        },

        onClickSaveAs: function() {
            this.showProjectPopupScreen('save-as');
        },

        onChangeProjectName: function() {

            var value = this.ui.projectName.val();

            // Check non-empty and at least one non-whitespace character
            if( value && value.length > 0 && value.match(/\S/) ) {
                this.ui.saveAsConfirmButton.removeClass('disabled');
            } else {
                this.ui.saveAsConfirmButton.addClass('disabled');
            }

        },

        onClickSaveAsConfirm: function() {

            var $projectName = this.ui.projectName,
                $saveButton = this.ui.saveAsConfirmButton,
                projectName = $projectName.val(),
                project = Communicator.reqres.request('project'),
                newProject;

            $projectName.addClass('disabled');
            $saveButton.addClass('disabled');
            $saveButton.text('Saving...');

            newProject = project.clone();
            newProject.set({id: null, name: projectName});

            newProject.save(null, {
                success: this.onSaveAsSuccess,
                error: this.onSaveAsError
            });

        },

        onSaveAsSuccess: function(data) {

            this.ui.saveAsConfirmButton.text('Saved!');
            this.ui.projectPopup.fadeOut('slow');

            ProjectModule.setProject( data );

        },

        onSaveAsError: function() {

            // We should probably handle this a bit better...
            this.ui.saveAsConfirmButton.text('Error');

        },

        onClickClose: function() {

            // Triggers project save and switch back to tutorials list
            Communicator.mediator.trigger('project:close');

        },

        showProjectPopupScreen: function(screenName) {

            this.resetProjectPopup();

            this.ui.projectPopupScreens.removeClass('current');
            this.ui.projectPopup.find('[data-screen="'+screenName+'"]').addClass('current');
        },

        resetProjectPopup: function() {

            this.ui.projectName.val('').removeClass('disabled');
            this.ui.saveAsConfirmButton.text('Save').addClass('disabled');

        },

        onCopyComplete: function() {
            this.ui.copiedMessage.css('visibility', 'visible');
        }
    });

});
