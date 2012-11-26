class BaseClass extends Backbone.Model

    Linked: () =>
        @._linked

    Link: (form) =>
        if @._linked == false
          $(form).backboneLink(@, {'prefixed':true})
          @._linked = true
        else
          $(form).backbonePopulate(@, {'prefixed':true})

    Dirty: () ->
        #@collection.Dirty()
        @._dirty = true

    Clean: () ->
        @._dirty = false

    isDirty: () =>
        @._dirty

