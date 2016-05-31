/**
 Diese Code Orientiert sich an dem ccm-chat von andre kless und wurde zu einem Kommentar Modul angepasst und umgebaut
 **/
ccm.component( {

  name: 'Comment_section_von_Rudolf',

  config: {

    html:  [ ccm.store, { local: 'templates.json' } ],
    key:   'test',
    store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'Comment_section_von_Rudolf' } ],
    style: [ ccm.load, 'style.css' ],
    user:  [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ]

  },

  Instance: function () {

    var self = this;

    self.init = function ( callback ) {

      self.store.onChange = function () { self.render(); };

      callback();

    };

    self.render = function ( callback ) {

      var element = ccm.helper.element( self );

      self.store.get( self.key, function ( dataset ) {

        if ( dataset === null )
          self.store.set( { key: self.key, comments: [] }, proceed );
        else
          proceed( dataset );

        function proceed( dataset ) {

          element.html( ccm.helper.html( self.html.get( 'main' ) ) );

          var comments_div = ccm.helper.find( self, '.comments' );



          for ( var i = 0; i < dataset.comments.length; i++ ) {

            var comment = dataset.comments[ i ];
	   

            comments_div.prepend( ccm.helper.html( self.html.get( 'comment' ), {

              name: (ccm.helper.val( comment.user ).concat(" kommentierte")),
              text: ccm.helper.val( comment.text )

            } ) );
			

          

          }
comments_div.prepend( ccm.helper.html( self.html.get( 'input' ), { onsubmit: function () {

            var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val() ).trim();

	    	       var currentdate = new Date(); 
		var datetime = "  // Datum: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " Uhrzeit: "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		var dateappend = "    // Zeitpunkt des Kommentars: ".concat(datetime.toString());
	    
            if ( value === '' ) return;

            self.user.login( function () {
	      var newvalue = value.concat(datetime)
              dataset.comments.push( { user: self.user.data().key, text: newvalue } );

              self.store.set( dataset, function () { self.render(); } );
	      
            } );

            return false;

          } } ) );
          

          if ( callback ) callback();

        }

      } );

    };

  }

} );


