ccm.component( {

  name: 'Comment_section_von_Rudolf',

  config: {
    html:    [ ccm.store, { local: 'templates.json' } ],
    key:     'test',
    store:   [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'Comment_section_von_Rudolf' } ],
    style:   [ ccm.load, 'style.css' ],
    user:    [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ],
    rating:  [ ccm.component, 'https://kaul.inf.h-brs.de/ccm/components/rating.js', {
      store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'rhanel2s_comment_ratings' } ]
      // [AK] use only data level 1 or 3, data level 2 has a bug at moment
    } ]
  },

  Instance: function () {
	var k = 0;
    var x = 0;
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
			var n = dataset.comments.length;
          for ( var i = n-k; i < n; i++ ) {

            var comment = dataset.comments[ i ];


			/** Links and Images **/

			var str = ccm.helper.val( comment.text );
			var Sentence = str.split(" ");
			for (var j = 0, len = Sentence.length; j < len; j++) {
 			word = Sentence[j];
			Inhalt = word;
			var control = 0;
			//.jpg
			if(word.match(/(\b\S+\b.jpg)/ig) !==null){
			result = word.match(/(\b\S+\b.jpg)/ig);
			Inhalt = word.replace(result, 
			'<img src='+'"'+word+'"'+ 'width="128" height="128"' + '>' );
			}
			if(word.match(/(\b\S+\b.png)/ig) !==null){
			result = word.match(/(\b\S+\b.png)/ig);
			Inhalt = word.replace(result, 
			'<img src='+'"'+word+'"'+ 'width="128" height="128"' + '>' );	
			}			
			//.gif

			if(word.match(/(\b\S+\b.gif)/ig) !==null){
			result = word.match(/(\b\S+\b.gif)/ig);
			Inhalt = word.replace(result, 
			'<img src='+'"'+word+'"'+ 'width="128" height="128"' + '>' );	
			}

			if(word.match(/(\bhttp\S+\b)/ig)!==null){
			result = word.match(/(\bhttp.\S+\b)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="'+word+'"'+'>'+ Inhalt + '</a>' );				
}			else if(word.match(/(\www.\S+\b)/ig)!==null) {
			result = word.match(/(\bwww.\S+\b)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://'+word+'"'+'>'+ Inhalt + '</a>' );
}			else{
			/**endungen**/
			
			if(word.match(/(\b\S+\b).com/ig)!==null ){
			result = word.match(/(\b\S+\b.com)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}			else if(word.match(/(\b\S+\b.de)/ig)!==null ){
			result = word.match(/(\b\S+\b.de)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}
			else if(word.match(/(\b\S+\b.uk)/ig)!==null ){
			result = word.match(/(\b\S+\b.uk)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}
			else if(word.match(/(\b\S+\b.net)/ig)!==null ){
			result = word.match(/(\b\S+\b.net)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}
			
			else if(word.match(/(\b\S+\b.org)/ig)!==null ){
			result = word.match(/(\b\S+\b.org)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}

			else if(word.match(/(\b\S+\b.gov)/ig)!==null ){
			result = word.match(/(\b\S+\b.gov)/ig);
			Sentence[j] = word.replace(result, 
			'<a href="https://www.'+word+'"'+'>'+ Inhalt + '</a>' );			
}
			/**endungen vorbei**/
			}

}

			var res = Sentence.join(" ");


            comments_div.prepend( ccm.helper.html( self.html.get( 'comment' ), {

              name: ( ccm.helper.val( comment.user ) ),
              text: res,
				no: ccm.helper.val( comment.no ),
              date: ccm.helper.val( comment.date )
              // [AK] no replacing of rating specific stuff here, only empty div for rating is needed (see little templates.json change)

            } ) );
			var num = ccm.helper.val( comment.no );
            // [AK] give empty div for rating an unique id and render rating
            var id = self.index + '-rating-' + ( i + 1 );
            ccm.helper.find( self, '.rating:first' ).attr( 'id', id );
            self.rating.render( { key: i.toString(), element: jQuery( '#' + id ) } );

          }
comments_div.append( ccm.helper.html( self.html.get( 'showmore' ), { onsubmit: function (){
if(n>k+5){
k = k+5;
}
else{
k = n
}
self.render();
}}));

comments_div.prepend( ccm.helper.html( self.html.get( 'showless' ), { onsubmit: function (){
k = k-5;
self.render();

}}));

          comments_div.prepend( ccm.helper.html( self.html.get( 'input' ), { onsubmit: function () {

            var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val() ).trim();
			


			
            var currentdate = new Date();
			
            if ( value === '' ) return;
			//var boo = ccm.helper.html( self.html.get( 'checked' ));
			//var boo = document.getElementById('isAgeSelected').checked;

            self.user.login( function () {
			
              dataset.comments.push( {
                no: x++,
                user: self.user.data().key,
                text: value,
                date: currentdate
              } );
			

              // [AK] removed all rating specific stuff around here

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
