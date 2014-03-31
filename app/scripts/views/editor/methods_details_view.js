/*global define:true*/
/*jshint camelcase:false*/
/*global js_beautify:false */

/**
 * For the Methods panel where we either list the methods for an object, or show the code view for a specific method.
 */
define([
    'jquery',
	'communicator',
	'backbone.marionette',
    'ace',
	'hbs!tmpl/view/editor/methods_details_template'
], function(
    $,
	Communicator,
	Marionette,
    ace,
	methodsDetailsTemplate
) {

	'use strict';

	var MethodsDetailsView = Marionette.ItemView.extend({
		template: {
			type: 'handlebars',
			template: methodsDetailsTemplate
		},

		initialize: function() {
            Communicator.mediator.on( 'method:selected', this.render, this );
		},

        events: {
            'click .method': 'onClickMethod'
        },

		modelEvents: {
			'change': 'onModelChange'
		},

        ui: {
            'codeView': '.code-view'
        },

		onModelChange: function() {
            this.render();
		},

        onRender: function() {

            var code;

            if( this.ui.codeView.length > 0 ) {

                if( !this.editor ) {
                    this.editor = ace.edit(this.ui.codeView[0]);
                    this.editor.getSession().setMode('ace/mode/javascript');
                    // TODO When we are ready to enable code editing, remove this
                    this.editor.setReadOnly(true);
                }

                // Prettify
                code = this.editor.getSession().getValue();

                /**
                 * NB. For now we can't use js_beautify via requirejs due to this issue:
                 * https://github.com/jrburke/requirejs/issues/883
                 */
                this.editor.getSession().setValue( js_beautify(code) );

            }

        },

		serializeData: function() {

            var ideModel = Communicator.reqres.request( 'ide:model' ),
                methods = this.model ? this.model.get('methods') : null,
                selectedEntityId = this.model ? this.model.get('id') : null,
                selectedMethodName = ideModel.getSelectedMethodName(),
                selectedMethod = null;

            if( selectedMethodName ) {
                selectedMethod = methods.findWhere( {name: selectedMethodName} );
            }

			return {
				methods: methods ? methods.toJSON() : null,
                selectedMethodName: selectedMethodName,
                selectedMethod: selectedMethod ? selectedMethod.toJSON() : null,
				entityId: selectedEntityId
			};

		},


        onClickMethod: function(e) {

            var $el = $(e.currentTarget),
                methodName = $el.data('method');

            Communicator.mediator.trigger( 'method:selected', methodName );

        }

	});

	return MethodsDetailsView;

});
