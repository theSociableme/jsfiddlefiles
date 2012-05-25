(function( $ ) {
  $.widget( "ui.combobox", {
    options: {
      insert_add_entry: false,
      add_prompt: "add",
      precede_new_with: ''
    },

    _create: function() {
      var self = this,
        select = this.element.hide(),
        selected = select.children( ":selected" ),
        value = selected.val() ? selected.text() : "";

     $(this.element).live('bbPop', function(e, data){
         console.log('bbPop triggered');
         debugger;
         $(input).val(data);
     });

      var input = this.input = $( "<input>" )
        .insertAfter( select )
        .val( value )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            selected_children = 
             select.children( "option" ).map(function() {
              var text = $( this ).text();
              if ( this.value && ( !request.term || matcher.test(text) ) )
                return {
                  label: text.replace(
                    new RegExp(
                      "(?![^&;]+;)(?!<[^<>]*)(" +
                      $.ui.autocomplete.escapeRegex(request.term) +
                      ")(?![^<>]*>)(?![^&;]+;)", "gi"
                    ), "<strong>$1</strong>" ),
                  value: text,
                  option: this
                };
            })

            returned_children = []
            if (self.options.insert_add_entry) {
              options = select.children("option").map(function() {
                return $(this).text();
              });

              trimmed_user_entry = request.term.trim();
              if (trimmed_user_entry != "" ) {
                // look through options for exact match
                found_match = false;
                for (i = 0; i < options.length; i++) {
                  if (trimmed_user_entry == options[i] && trimmed_user_entry != "")
                    found_match = true;
                }
                // if no exact match then add option to add entry
                if (!found_match)
                    returned_children = [{label: self.options.add_prompt + " " + trimmed_user_entry, value: self.options.precede_new_with + trimmed_user_entry}]
              }
            }
            
            // append matching options to optional add
            for (i = 0; i < selected_children.length; i++)
              returned_children.push(selected_children[i]);
            response(returned_children);
          },

          select: function( event, ui ) {
              console.log("select function");
            if (!(ui.item.option)) {
              ui.item.option = $('<option value="' + ui.item.value + '">' + ui.item.value + '</option>')
              select.append(ui.item.option);
            }

            $(ui.item.option).attr("selected", "selected")
            self._trigger( "selected", event, {
              item: ui.item.option
            });
            select.trigger("change");
          },

          change: function( event, ui ) {
            console.log("on change, enter_pressed: ");
            if ( !ui.item ) {
              var matcher = new RegExp( "^(" + self.options.precede_new_with + ")" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                valid = false;
                select.children( "option" ).each(function() {
                if ( $( this ).text().match( matcher ) ) {
                  this.selected = valid = true;
                  return false;
                }
              });
              if ( !valid ) {
                new_value = self.options.precede_new_with + $(this).val()
                option = $('<option value="' + new_value + '">' + $(this).val() + '</option>')
                select.append(option);
                select.val(new_value);
                return false;
              }
            }
          }
        })
        .addClass( "ui-widget ui-widget-content ui-corner-left" );

      input.data( "autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + item.label + "</a>" )
          .appendTo( ul );
      };

      input.keypress(function(event) {
        if ( event.which == 13 ) {
          event.preventDefault();
          value = $(this).val();
          
          matching_option = select.children('option[value="' + self.options.precede_new_with + value + '"]')
          if (matching_option.length == 1)
            item = {option: matching_option[0]};
          else
            item = {value: $(this).val()};
          input.autocomplete("option", "select")(event, {item: item});
          input.autocomplete("close");
        }
      });

      this.button = $( "<button type='button'>&nbsp;</button>" )
        .attr( "tabIndex", -1 )
        .attr( "title", "Show All Items" )
        .insertAfter( input )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        })
        .removeClass( "ui-corner-all" )
        .addClass( "ui-corner-right ui-button-icon" )
        .click(function() {
          // close if already visible
          if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
            input.autocomplete( "close" );
            return;
          }

          // work around a bug (likely same cause as #5265)
          $( this ).blur();

          // pass empty string as value to search for, displaying all results
          input.autocomplete( "search", "" );
          input.focus();
        });
    },

    destroy: function() {
      this.input.remove();
      this.button.remove();
      this.element.show();
      $.Widget.prototype.destroy.call( this );
    }
  });
})( jQuery );

