(function( $, window, document, undefined ) {
  $.fn.tweetme = function(options) {  
    $this = $(this);
    
    var defaults = {
        limit: 10,
        num_tweets: 3,
        source: "feed",
        direction: "up",
        speed: 6000,
        pause: 4000,
        mousePause: "true"
    }

    var isPaused = false,
        tweet_url = 'http://twitter.com/';

    options = validateOptions ( options );
    if ( options ) {
        init();
    }

    function validateOptions ( options ) {
        if ( undefined === typeof options.user_profile ) {
            console.log ( 'You need to specify a user profile via options["user_profile"]');
            return false;
        }

        if ( undefined === typeof options.source || !options.source.match(/feed|search/i) )
            options.source = defaults.source;

    if ( !options.direction.match(/up|down/i))
            options.direction = defaults.direction;

        options.speed = parseInt ( options.speed );
        if ( NaN === options.speed || !options.speed )
            options.speed = defaults.speed;

        options.pause = parseInt ( options.pause );
        if ( NaN === options.pause || !options.pause )
            options.pause = defaults.pause;

        options.limit = parseInt ( options.limit );
        if ( NaN === options.limit || !options.limit )
            options.limit = defaults.limit;
            
        options.num_tweets = parseInt ( options.num_tweets );
        if ( NaN === options.num_tweets || !options.num_tweets )
            options.num_tweets = defaults.num_tweets;

        return options;
    }

    function init() {
      if( options.source.toLowerCase() == "feed" ){
            var url="https://api.twitter.com/1/statuses/user_timeline/" + options.user_profile + ".json?include_entities=true&include_rts=true&screen_name="+options.user+"&callback=?";
      } else{    
            var url = "http://search.twitter.com/search.json?q=%23" + options.query + "&callback=?";
      }

      getTweets( url );
    }
    
    function buildFrag( data ){
      $.each(data, function(i, tweet){        
        html = "<li><a href="+tweet.author_url+" class='image'><img src="+tweet.img_url+"></a>";
        html += "<p><a href="+tweet.author_url+">"+tweet.author+"</a>: "+tweet.text+"</p></li>";
        
        $this.append( html );
      })      
    }
        
    function getTweets( url ){      
      $.getJSON( url, function( data ){        
      data = ( options.source == "feed" ) ? data : data.results;
      
      tweets = $.map(data, function( tweet ){
       if( tweet.from_user && tweet.profile_image_url ){
        author = tweet.from_user;
        img_url = tweet.profile_image_url;
       }else{
        author = tweet.user.name;
        img_url = tweet.user.profile_image_url;
       }
       
        return{
          author: author,
          author_url:  tweet_url + author,
          img_url: img_url,
          text: tweet.text,
          date: tweet.created_at
        }
        });
        
        limit( tweets, options.limit );
      });
      
    }
    
    function limit( obj, count ){       
      tweets = obj.slice(0, count);
      
      buildFrag( tweets );        
    }

    function autoScroll(){
      if( options.direction == "up" ){
        var elem = ':first',
            eq = '-=',
            place = 'appendTo';
      }else{
        var elem = ':last',
            eq = '+=',
            place = 'prependTo';
      }
      var childElem = $this.children(elem);
      var elemHeight = childElem.outerHeight();

      $this.animate({
        'top': eq + elemHeight + 'px'
      }, 'slow', function(){
          childElem.hide()[place]($this).fadeIn();
          $this.css('top', 0);
        }
      )         
    }

    var moveScroll = setInterval(autoScroll, options.speed);

  };
})( jQuery, window, document );