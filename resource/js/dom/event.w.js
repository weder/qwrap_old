/** 
* @class EventW Event Wrap��event�����װ��
* @namespace QW
*/
QW.EventW = function () {
	this.chromeHack; //chrome bug hack

	/** 
	* @property core ԭ��Eventʵ��
	* @type {Event}
	*/
	this.core = QW.EventH.getEvent.apply(null, arguments);

	/** 
	* @property target �¼�������Ԫ��
	* @type {HTMLElement}
	*/
	this.target = this.target();

	/** 
	* @property relatedTarget mouseover/mouseout �¼�ʱ��Ч overʱΪ��ԴԪ��,outʱΪ�ƶ�����Ԫ��.
	* @type {HTMLElement}
	*/
	this.relatedTarget = this.relatedTarget();

	/** 
	* @property pageX ���λ������ҳ���X����
	* @type {int}
	*/
	this.pageX = this.pageX();

	/** 
	* @property pageX ���λ������ҳ���Y����
	* @type {int}
	*/
	this.pageY = this.pageY();
	//this.layerX = this.layerX();
	//this.layerY = this.layerY();

	/** 
	* @property detail �����ַ��� ����0����,С��0����.
	* @type {int}
	*/
	this.detail = this.detail();

	/** 
	* @property keyCode �¼������İ�����Ӧ��ascii��
	* @type {int}
	*/
	this.keyCode = this.keyCode();

	/** 
	* @property ctrlKey �¼�����ʱ�Ƿ������סctrl��
	* @type {boolean}
	*/
	this.ctrlKey = this.ctrlKey();

	/** 
	* @property shiftKey �¼�����ʱ�Ƿ������סshift��
	* @type {boolean}
	*/
	this.shiftKey = this.shiftKey();

	/** 
	* @property altKey �¼�����ʱ�Ƿ������סalt��
	* @type {boolean}
	*/
	this.altKey = this.altKey();

	/** 
	* @property button �¼�����������λ(������) ����ie��������������Ժܲ���ͬ������û�������ݴ������ﷵ�ص���ԭ�����
	* @type {boolean}
	*/
	this.button = this.core.button;
};

QW.HelperH.methodizeTo(QW.EventH, QW.EventW.prototype, 'core');