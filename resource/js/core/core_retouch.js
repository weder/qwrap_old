/*
	author: JK
*/

/*
��Ⱦ�ڲ�����
*/
(function(){
var HelperH=QW.HelperH,
	applyTo=HelperH.applyTo,
	methodizeTo=HelperH.methodizeTo;

/**
* @class Object ��չObject����ObjectH������Object���ر�˵����δ��Object.prototype����Ⱦ���Ա�֤Object.prototype�Ĵ�����
*/
applyTo(QW.ObjectH,Object);

/**
* @class Array ��չArray����ArrayH������Array
*/
applyTo(QW.ArrayH,Array);
methodizeTo(QW.ArrayH,Array.prototype);


/**
* @class Function ��չFunction����FunctionH/ClassH������Function
*/
Object.mix(QW.FunctionH, QW.ClassH);
applyTo(QW.FunctionH,Function);
methodizeTo(QW.FunctionH,Function.prototype);

/**
* @class String ��չString����StringH������String
*/
applyTo(QW.StringH,String);
methodizeTo(QW.StringH,String.prototype);

/**
* @class Date ��չDate����DateH������Date
*/
applyTo(QW.DateH,Date);
methodizeTo(QW.DateH,Date.prototype);

})();


