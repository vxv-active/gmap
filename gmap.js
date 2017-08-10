(function () {
  var Gmap = function( args ) {
    // thisがGmapのインスタンスでない際に、 new 演算子でコンストラクタを呼び出すようにする
    if ( !( this instanceof Gmap ) ) {
      return new Gmap( args );
    }

    // 全体の初期設定値
    var option = {
      // id
      show_ID: 'gmap',

      // pinを立てる位置
      latlng: new google.maps.LatLng(37.776795, -122.416604),

      // 吹き出し
      infoText: 'Twitter社だぜ！！！',

      // マップ名(任意) デフォルトはtwittere
      map_name: 'twitter',

      // // 左上のボタン(地図の表示タイプを変更するボタン)の表示名
      // mapIds_name: '',

      // ズームレベル
      zoom: 15,

      // gmap上でスクロールした際にズームさせるか
      scrollwheel: false,

      // オリジナルのpinにする際の画像パス
      pin_icon: '',

      /* ---------- *\
       | controller |
      \* ---------- */
      // mapの右下のズームのやつ
      zoomControl: true,

      // mapの左上のやつ
      mapTypeControl: true,

      // pegman
      streetViewControl: true,

      // 尺度の表示（画面右下の利用規約とかのところに表示）
      scaleControl: false,

      // 斜め45度画像の向きを制御する回転コントロールの生成
      rotateControl: false,

      // mapをfull画面で操作するためのアイコンの生成（右上に表示される）
      fullscreenControl: true,

      /* ------------------ *\
       | map type customize |
      \* ------------------ */
      featureOpts: [
        {
          "stylers": [
            {
              "hue": "#000"
            },
            {
              "saturation": -100
            }
          ],
          "elementType": "all",
          "featureType": "all",
        }
      ],
    };

    // extend
    var setting = Object.extend(
      true,
      option,
      args
    );

    // Mapの初期値
    var mapOptions = {
      // ズーム
      zoom: setting.zoom,

      // スクロールズーム
      scrollwheel: setting.scrollwheel,

      // MAPの真ん中
      center: setting.latlng,

      // mapの右下のズームのやつ
      zoomControl: setting.zoomControl,

      // mapの左上のやつ
      mapTypeControl: setting.mapTypeControl,

      // pegman
      streetViewControl: setting.streetViewControl,

      // 尺度の表示（画面右下の利用規約とかのところに表示）
      scaleControl: setting.scaleControl,

      // 斜め45度画像の向きを制御する回転コントロールの生成
      rotateControl: setting.rotateControl,

      // mapをfull画面で操作するためのアイコンの生成（右上に表示される）
      fullscreenControl: setting.fullscreenControl,
    };

    // 最初に表示するMAPの設定
    if ( setting.featureOpts[0] !== undefined ) {
      mapOptions.mapTypeId = setting.map_name;
    }

    // 左上のボタン(地図の表示タイプを変更するボタン)が表示されているときの名前
    var styledMapOptions = mapOptions.mapTypeControl ?
                         { name: setting.mapIds_name !== '' ?
                                 setting.mapIds_name :
                                 setting.map_name
                         } :
                         {};

    // googlemapの色味などのカスタマイズ
    if ( setting.featureOpts[0] !== undefined ) {
      var customMapType = new google.maps.StyledMapType( setting.featureOpts, styledMapOptions );
    }

    // 吹き出し
    var infowindow = new google.maps.InfoWindow({ content:setting.infoText });

    // // 左上のボタン(地図の表示タイプを変更するボタン)の設定
    // if ( mapOptions.mapTypeControl && Array.isArray( setting.mapTypeIds ) ) {
    //   if ( setting.mapTypeIds[0] === undefined ) {
    //     mapOptions.mapTypeControlOptions.mapTypeIds = [];
    //   } else {
    //     setting.mapTypeIds.forEach(function( val, index, array ) {
    //       mapOptions.mapTypeControlOptions.mapTypeIds[index] = val;
    //     });
    //     console.warn('If the "map type chage button" is not found, please check the argument of "mapTypeIds". ');
    //   }
    // } else {
    //   console.error('\'mapTypeIds\' is Array Only.');
    // }

    var gmap = new google.maps.Map( document.getElementById( setting.show_ID ), mapOptions );

    function initialize( map ) {
      map.mapDataProviders = '';

      var marker = new google.maps.Marker({
        position: setting.latlng,
        icon: setting.pin_icon,
        map: map,
      });

      google.maps.event.addListener( marker, 'click', function(){ infowindow.open( map,marker ); });

      infowindow.open( map, marker );

      if ( setting.featureOpts[0] !== undefined ) {
        map.mapTypes.set( setting.map_name, customMapType );
      }
    }

    google.maps.event.addDomListener( window, 'load', initialize( gmap ) );

    /*----------------------------*\
     |                            |
     |     call back Function     |
     |                            |
    \*----------------------------*/

    this.getOptions = function(){
      return option;
    };

    this.addListenerOnce = function( fn ) {
      google.maps.event.addListenerOnce( gmap, 'idle', function() {
        fn;
      });
    };
  };

  // カプセル化した後外から呼ばれたときに呼び出せるようにした処理
  window.Gmap = Gmap;

  // jQueryのextendを移植
  Object.extend = function() {
    var toString = Object.prototype.toString;
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;

      // Handle a deep copy situation
      if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
      }

      // Handle case when target is a string or something (possible in deep copy)
      // if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
      if ( typeof target !== "object" && toString.call( target ) !== '[object Function]' ) {
        target = {};
      }

      // Extend jQuery itself if only one argument is passed
      if ( i === length ) {
        target = this;
        i--;
      }

      for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = arguments[ i ] ) != null ) {

          // Extend the base object
          for ( name in options ) {
            src = target[ name ];
            copy = options[ name ];

            // Prevent never-ending loop
            if ( target === copy ) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            // if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
            if ( deep && copy && ( toString.call( copy ) === '[object Object]' ||
              ( copyIsArray = Array.isArray( copy ) ) ) ) {

              if ( copyIsArray ) {
                copyIsArray = false;
                clone = src && Array.isArray( src ) ? src : [];

              } else {
                // clone = src && jQuery.isPlainObject( src ) ? src : {};
                clone = src && toString.call( src ) === '[object Object]' ? src : {};
              }

              // Never move original objects, clone them
              target[ name ] = Object.extend( deep, clone, copy );

            // Don't bring in undefined values
            } else if ( copy !== undefined ) {
              target[ name ] = copy;
            }
          }
        }
      }

      // Return the modified object
      return target;
  };
})();
