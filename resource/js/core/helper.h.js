/*
	author: JK,wuliang
*/


/**
 * @class HelperH
 * <p>һ��Helper��ָͬʱ��������������һ������</p>
 * <ol><li>Helper��һ�������п�ö��proto���Եļ򵥶�������ζ���������for...in...ö��һ��Helper�е��������Ժͷ�����</li>
 * <li>Helper����ӵ�����Ժͷ�������Helper�Է����Ķ��������������������</li>
 * <div> 1). Helper�ķ��������Ǿ�̬���������ڲ�����ʹ��this��</div>
 * <div> 2). ͬһ��Helper�еķ����ĵ�һ��������������ͬ���ͻ���ͬ���͡�</div>
 * <li> Helper���͵����ֱ�����Helper���д��ĸH��β�� </li>
 * <li> ����ֻ�����һ����JSON��Ҳ���Ƿ�Helper��ͨ���ԡ�U����util����β�� </li>
 * <li> ����Util��HelperӦ���Ǽ̳й�ϵ������JavaScript�����ǰѼ̳й�ϵ���ˡ�</li>
 * </ol>
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var FunctionH = QW.FunctionH,
	ObjectH = QW.ObjectH;

var HelperH = {
	/**
	* ������Ҫ����wrap�����helper���������н����װ
	* @method rwrap
	* @static
	* @param {Helper} helper Helper����
	* @param {Class} wrapper ������ֵ���а�װʱ�İ�װ��(WrapClass)
	* @param {Object} wrapConfig ��Ҫ����Wrap����ķ���������
	* @return {Object} ������rwrap����<strong>�µ�</strong>Helper
	*/
	rwrap: function(helper, wrapper, wrapConfig){
		var ret = {};
		if(null == wrapConfig) wrapConfig = {};

		for(var i in helper){
			if((typeof wrapConfig == "number" || i in wrapConfig) && typeof helper[i] == "function"){
				var wrapC = typeof wrapConfig == "number" ? wrapConfig : wrapConfig[i];
				var rwrap = wrapper?FunctionH.rwrap:FunctionH.rdir;

				ret[i] = rwrap(helper[i], wrapper, wrapC);
			}
			else ret[i] = helper[i];
		}
		return ret;
	},

	/**
	* �������ã�����gsetter�·���������駲����ĳ�������������getter����setter
	* @method gsetter
	* @static
	* @param {Helper} helper Helper����
	* @param {Object} gsetterConfig ��Ҫ����Wrap����ķ���������
	* @return {Object} ������rwrap����<strong>�µ�</strong>helper
	*/
	gsetter: function(helper,gsetterConfig){
		gsetterConfig=gsetterConfig||{};
		for(var i in gsetterConfig){
			helper[i]=function(config){
				return function(){return helper[config[Math.min(arguments.length,config.length)-1]].apply(null,arguments);}
			}(gsetterConfig[i]);
		}
		return helper;
	},
	
	/**
	* ��helper�ķ���������mul����ʹ���ڵ�һ������Ϊarrayʱ�����Ҳ����һ������
	* @method mul
	* @static
	* @param {Object} helper Helper����
	* @param {boolean} recursive (Optional) �Ƿ�ݹ�
	* @return {Object} ������mul����<strong>�µ�</strong>Helper
	*/
	mul: function (helper, recursive){ 
		var ret = {};
		for(var i in helper){
			if(typeof helper[i] == "function")
				ret[i] = FunctionH.mul(helper[i], recursive);
			else
				ret[i] = helper[i];
		}
		return ret;
	},
	/**
	* ��һ��HelperӦ�õ�ĳ��Object�ϣ�Helper�ϵķ�����Ϊ��̬����������extend(obj,helper)
	* @method applyTo
	* @static
	* @param {Object} helper Helper������DateH
	* @param {Object} obj Ŀ�����.
	* @return {Object} Ӧ��Helper��Ķ��� 
	*/
	applyTo: function(helper,obj){

		return ObjectH.mix(obj, helper);  //��������
	},
	/**
	* ��helper�ķ���������methodize����ʹ��ĵ�һ������Ϊthis����this[attr]��
	* <strong>methodize������������helper�ϵķ�function���Ա�Լ��������»��߿�ͷ�ĳ�Ա��˽�г�Ա��</strong>
	* @method methodize
	* @static
	* @param {Object} helper Helper������DateH
	* @param {string} attr (Optional)����
	* @return {Object} ������methodize����<strong>�µ�</strong>Helper
	*/
	methodize: function(helper, attr){
		var ret = {};
		for(var i in helper){
			if(typeof helper[i] == "function" && !/^_/.test(i)){
				ret[i] = FunctionH.methodize(helper[i], attr); 
			}
		}
		return ret;
	},
	/**
	* <p>��һ��HelperӦ�õ�ĳ��Object�ϣ�Helper�ϵķ�����Ϊ���󷽷�</p>
	* @method methodizeTo
	* @static
	* @param {Object} helper Helper������DateH
	* @param {Object} obj  Ŀ�����.
	* @param {string} attr (Optional)��װ�����core�������ơ����Ϊ�գ�����this��������this[attr]������Helper�����ĵ�һ������
	* @return {Object} Ӧ��Helper��Ķ���
	*/
	methodizeTo: function(helper, obj, attr){

		helper = HelperH.methodize(helper,attr);	//������
		
		return ObjectH.mix(obj, helper);  //��������		 
	},
	/**
	* �õ�һ��HelperWrap
	* @method wrap
	* @static
	* @param {Helper} h1 Helper������DateH
	* @param {Helper} h2 (Optional) �����ж��Helper.
	* @return {HelperW} ����һ��Helper��Wrap����
	*/
	wrap: function(){
		var helper = ObjectH.mix({},[].slice.call(arguments));
		function HWrap(helper){
			this.core = helper;
		};
		var h = HelperH.rwrap(HelperH, HWrap, -1);
		HelperH.methodizeTo(h, HWrap.prototype, "core");
		return new HWrap(helper);
	},
	/**
	* ����һ��Helper����һ������ Helper�ϵķ�����Ϊ���󷽷���_init��Ϊ���캯�� 
	* @method createClass
	* @static
	* @param {Object} helper Helper������DateH 
	* @return {Function} �������Ķ���
	*/
	createClass : function(helper){
		var C = function(){};
		if(typeof helper._init == "function"){
			C = FunctionH.methodize(helper._init);
		}
		HelperH.methodizeTo(helper.prototype, C);	
		return C;
	}
};

QW.HelperH = HelperH;
})();
