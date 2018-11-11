RandomDataGenerator = function(s) {
    if ( s === undefined ) s = Date.now();

    var a = 1664525,
	    c = 1013904223,
	    m = Math.pow(2, 32),
        seed = s;

    this.seed = function( s ) {
        seed = s;
    };

    this.nextInt = function() {
        seed = ( a * seed + c ) % m;
        return seed;
    };

    this.nextFloat = function() {
        return this.nextInt() / m;
    };

    this.integer = function( a, b ) {
        if ( a === undefined ) {
            a = 0;
            b = 1;
        }
        if ( b === undefined ) {
            b = a;
            a = 0;
        }

        return Math.floor( a + this.nextFloat() * ( b - a + 1 ) );
    };

    this.f = function( a, b ) {
        if ( a === undefined ) {
            a = 0;
            b = 1;
        }
        if ( b === undefined ) {
            b = a;
            a = 0;
        }
        return a + this.nextFloat() * ( b - a );
    };

    this.pick = function( arr ) {
        return arr[ this.integer( arr.length - 1 ) ];
    };
}