//test
void function () {
	var QW = window.QW
		, ObjectH = QW.ObjectH
		, mix = ObjectH.mix
		, getType = ObjectH.getType
		, push = Array.prototype.push
		, HH = QW.HelperH
		, applyTo = HH.applyTo
		, methodizeTo = HH.methodizeTo
		, NodeH = QW.NodeH
		, $ = NodeH.$
		, query = NodeH.query
		, contains = NodeH.contains
		, EventTargetH = QW.EventTargetH
		, EventW = QW.EventW
		, NodeC = QW.NodeC;


	/*
	 * EventTarget Helper onfire ������չ
	 * @class EventTargetH
	 * usehelper QW.EventTargetH
	*/

	EventTargetH.fireHandler = function (element, e, handler, name) {
		var we = new EventW(e);
		return handler.call(element, we);
	};

	/*
	 * Node Helper ��չ
	 * @class NodeH
	 * @usehelper QW.NodeH
	 */
	mix(NodeH,EventTargetH);
	HH.gsetter(NodeH,NodeC.gsetterMethods);//����gsetters


	var NodeH2 = HH.mul(QW.NodeH, true);
	HH.gsetter(NodeH2,NodeC.gsetterMethods);//����gsetters

	/**
	* @class Dom ��QW.DomU��QW.NodeH�ϲ���QW.Dom��Ը��ɵĴ��뱣��һ��
	* @singleton 
	* @namespace QW
	*/
	var Dom = QW.Dom = {};
	mix(Dom, [QW.DomU, NodeH2]);




	/**
	*@class NodeW Element��װ����
	* <p>NodeW���˼���NodeH�ķ���֮�⣬Ҳ���Ը���ʵ����Ҫ���ɸ���ķ�����֧���������ֵ��÷�ʽ</p>
	* <p>���췽ʽ��var w=new NodeW(core);</p>
	* <p>������ʽ��var w=NodeW(sSelector,refEl);</p>
	*@namespace QW
	*/

	/** 
	* ���element�����outerHTML����
	* @method	outerHTML
	* @param	{object}				doc		(Optional)document Ĭ��Ϊ ��ǰdocument
	* @return	{string}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* �ж�element�Ƿ����ĳ��className
	* @method	hasClass
	* @param	{string}				className	��ʽ��
	* @return	{boolean}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element���className
	* @method	addClass
	* @param	{string}				className	��ʽ��
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* �Ƴ�elementĳ��className
	* @method	removeClass
	* @param	{string}				className	��ʽ��
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* �滻element��className
	* @method	replaceClass
	* @param	{string}				oldClassName	Ŀ����ʽ��
	* @param	{string}				newClassName	����ʽ��
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* element��className1��className2�л�
	* @method	toggleClass
	* @param	{string}				className1		��ʽ��1
	* @param	{string}				className2		(Optional)��ʽ��2
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ��ʾelement����
	* @method	show
	* @param	{string}				value		(Optional)display��ֵ Ĭ��Ϊ��
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����element����
	* @method	hide
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����/��ʾelement����
	* @method	toggle
	* @param	{string}				value		(Optional)��ʾʱdisplay��ֵ Ĭ��Ϊ��
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* �ж�element�����Ƿ�ɼ�
	* @method	isVisible
	* @return	{boolean}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡelement�������doc��xy����
	* @method	getXY
	* @return	{array}					x, y	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element�����xy����
	* @method	setXY
	* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
	* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����element�����offset���
	* @method	setSize
	* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
	* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����element����Ŀ��
	* @method	setInnerSize
	* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
	* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����element�����offset��ߺ�xy����
	* @method	setRect
	* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
	* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
	* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
	* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����element����Ŀ�ߺ�xy����
	* @method	setRect
	* @param	{int}					x			(Optional)x���� Ĭ�ϲ�����
	* @param	{int}					y			(Optional)y���� Ĭ�ϲ�����
	* @param	{int}					w			(Optional)�� Ĭ�ϲ�����
	* @param	{int}					h			(Optional)�� Ĭ�ϲ�����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ��ȡelement����Ŀ��
	* @method	getSize
	* @return	{object}				width,height	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡelement����Ŀ�ߺ�xy����
	* @method	setRect
	* @return	{object}				width,height,left,top,bottom,right	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����ȡelement���󸴺��������ֵܽڵ�
	* @method	nextSibling
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ǰ��ȡelement���󸴺��������ֵܽڵ�
	* @method	previousSibling
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���ϻ�ȡelement���󸴺��������ֵܽڵ�
	* @method	previousSibling
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���ϻ�ȡelement���󸴺��������ֵܽڵ�
	* @method	previousSibling
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodeW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���ϻ�ȡelement���󸴺��������ֵܽڵ�
	* @method	parentNode
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodeW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element��������ʼλ�û�ȡ���������Ľڵ�
	* @method	firstChild
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodeW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element�����ڽ���λ�û�ȡ���������Ľڵ�
	* @method	lastChild
	* @param	{string}				selector	(Optional)��ѡ���� Ĭ��Ϊ�ռ�������ֵܽڵ�
	* @return	{NodeW}					�ҵ���node��null	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* �ж�Ŀ���Ƿ���element���������ڵ�
	* @method	contains
	* @param	{element|string|wrap}	target		Ŀ�� id,Elementʵ����wrap
	* @return	{boolean}				�жϽ��	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element����ǰ/������ʼ���ڽ�β����html
	* @method	insertAdjacentHTML
	* @param	{string}				type		λ������
	* @param	{element|string|wrap}	html		�����html
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ��element����ǰ/������ʼ���ڽ�β����element����
	* @method	insertAdjacentElement
	* @param	{string}				type		λ������
	* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element������׷��element����
	* @method	firstChild
	* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element����ǰ����element����
	* @method	insertSiblingBefore
	* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element��������element����
	* @method	insertSiblingAfter
	* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element�����ڲ���ĳԪ��ǰ����element����
	* @method	insertBefore
	* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
	* @param	{element|string|wrap}	relement	���뵽id,Elementʵ����wrapǰ
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element�����ڲ���ĳԪ�غ����element����
	* @method	insertAfter
	* @param	{element|string|wrap}	nelement	Ŀ��id,Elementʵ����wrap
	* @param	{element|string|wrap}	nelement	���뵽id,Elementʵ����wrap��
	* @return	{NodeW}					Ŀ��element����	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���Լ���Ŀ���滻
	* @method	replaceNode
	* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap
	* @return	{NodeW}					���滻�ɹ����˷����ɷ��ر��滻�Ľڵ㣬���滻ʧ�ܣ��򷵻� NULL	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element���relement�滻��nelement
	* @method	replaceChild
	* @param	{element|string|wrap}	nelement	�½ڵ�id,Elementʵ����wrap
	* @param	{element|string|wrap}	relement	���滻��id,Elementʵ����wrap��
	* @return	{NodeW}					���滻�ɹ����˷����ɷ��ر��滻�Ľڵ㣬���滻ʧ�ܣ��򷵻� NULL	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element�Ƴ���
	* @method	removeNode
	* @return	{NodeW}					��ɾ���ɹ����˷����ɷ��ر�ɾ���Ľڵ㣬��ʧ�ܣ��򷵻� NULL��	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��element���target�Ƴ���
	* @method	removeChild
	* @param	{element|string|wrap}	target		Ŀ��id,Elementʵ����wrap��
	* @return	{NodeW}					��ɾ���ɹ����˷����ɷ��ر�ɾ���Ľڵ㣬��ʧ�ܣ��򷵻� NULL��	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��Ԫ�ص���ObjectH.get
	* @method	get
	* @param	{string}				property	��Ա����
	* @return	{object}				��Ա����	����Ƕ��element�İ�װ�򷵻ؽ������
	* @see ObjectH.getEx
	*/

	/** 
	* ��Ԫ�ص���ObjectH.set
	* @method	set
	* @param	{string}				property	��Ա����
	* @param	{object}				value		��Ա����/����
	* @return	{NodeW}					�Լ�
	* @see ObjectH.setEx
	*/
	
	/** 
	* ��ȡelement���������
	* @method	getAttr
	* @param	{string}				attribute	��������
	* @param	{int}					iFlags		(Optional)ieonly ��ȡ����ֵ�ķ������� ����ֵ0,1,2,4 
	* @return	{string}				����ֵ ie���п��ܲ���object		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element���������
	* @method	setAttr
	* @param	{string}				attribute	��������
	* @param	{string}				value		���Ե�ֵ
	* @param	{int}					iCaseSensitive	(Optional)
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ɾ��element���������
	* @method	removeAttr
	* @param	{string}				attribute	��������
	* @param	{int}					iCaseSensitive	(Optional)
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ������������element��Ԫ��
	* @method	query
	* @param	{string}				selector	����
	* @return	{array}					elementԪ������		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element�����а���className�ļ���
	* @method	getElementsByClass
	* @param	{string}				className	��ʽ��
	* @return	{array}					elementԪ������		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡelement��value
	* @method	getValue
	* @return	{string}				Ԫ��value		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element��value
	* @method	setValue
	* @param	{string}				value		����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ��ȡelement��innerHTML
	* @method	getHTML
	* @return	{string}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element��innerHTML
	* @method	setHtml
	* @param	{string}				value		����
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ���form������elements����valueת������'&'���ӵļ�ֵ�ַ���
	* @method	encodeURIForm
	* @param	{string}	filter	(Optional)	���˺���,�ᱻѭ�����ô��ݸ�item������Ҫ�󷵻ز���ֵ�ж��Ƿ����
	* @return	{string}					��'&'���ӵļ�ֵ�ַ���		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* �ж�form�������Ƿ��иı�
	* @method	isFormChanged
	* @param	{string}	filter	(Optional)	���˺���,�ᱻѭ�����ô��ݸ�item������Ҫ�󷵻ز���ֵ�ж��Ƿ����
	* @return	{bool}					�Ƿ�ı�		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���element�������ʽ
	* @method	getStyle
	* @param	{string}				attribute	��ʽ��
	* @return	{string}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ���element����ǰ����ʽ
	* @method	getCurrentStyle
	* @param	{string}				attribute	��ʽ��
	* @return	{string}				����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ����element�������ʽ
	* @method	setStyle
	* @param	{string}				attribute	��ʽ��
	* @param	{string}				value		ֵ
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ��ȡelement�����border���
	* @method	borderWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡelement�����padding���
	* @method	paddingWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡelement�����margin���
	* @method	marginWidth
	* @return	{array}					topWidth, rightWidth, bottomWidth, leftWidth	����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö����value����		��һ��������setValue,����������getValue
	* @method	val
	* @return	{NodeW|string}			����ʱ�������Լ� ��ȡʱ�����ַ�		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö����innerHTML����	��һ��������setHTML,����������getHTML
	* @method	html
	* @return	{NodeW|string}			����ʱ�������Լ� ��ȡʱ�����ַ�		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö����Attribute����	������������setAttr,һ��������getAttr
	* @method	attr
	* @return	{NodeW|string}			����ʱ�������Լ� ��ȡʱ�����ַ�		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö���ǰ��style����	������������setStyle,һ��������getCurrentStyle
	* @method	css
	* @return	{NodeW|string}			����ʱ�������Լ� ��ȡʱ�����ַ�		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö���ǰ�Ĵ�С����	��һ��������������setSize,����������getSize
	* @method	size
	* @return	{NodeW|object}			����ʱ�������Լ� ��ȡʱ����{width:...,height:...}		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��ȡ�������ö���ǰ�Ĵ�С����	��һ��������������setXY,����������getXY
	* @method	xy
	* @return	{NodeW|array}			����ʱ�������Լ� ��ȡʱ����[x,y]		����Ƕ��element�İ�װ�򷵻ؽ������
	*/

	/** 
	* ��Ӷ�ָ���¼��ļ���
	* @method	on
	* @param	{string}	oldname		�¼�����
	* @param	{function}	handler		�¼��������
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* �Ƴ���ָ���¼��ļ���
	* @method	un
	* @param	{string}	oldname		(Optional)�¼�����
	* @param	{function}	handler		(Optional)�¼��������
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ����¼�ί��
	* @method	delegate
	* @param	{string}	selector	ί�е�Ŀ��
	* @param	{string}	oldname		�¼�����
	* @param	{function}	handler		�¼��������
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* �Ƴ��¼�ί��
	* @method	undelegate
	* @param	{string}	selector	(Optional)ί�е�Ŀ��
	* @param	{string}	oldname		(Optional)�¼�����
	* @param	{function}	handler		(Optional)�¼��������
	* @return	{NodeW}					�Լ�
	*/

	/** 
	* ���������ָ���¼�
	* @method	fire
	* @param	{string}	oldname	�¼�����
	* @return	{NodeW}		�Լ�
	*/

	/** 
	* �󶨶����click�¼�����ִ��click����
	* @method	click
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{NodeW}		�Լ�
	*/

	/** 
	* �󶨶����submit�¼�����ִ��submit����
	* @method	submit
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{NodeW}		�Լ�
	*/

	/** 
	* �󶨶����focus�¼�����ִ��focus����
	* @method	focus
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{NodeW}		�Լ�
	*/

	/** 
	* �󶨶����blur�¼�����ִ��blur����
	* @method	blur
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{NodeW}		�Լ�
	*/

	/** 
	* ��¡Ԫ��
	* @method	cloneNode
	* @param	{bool}		bCloneChildren	(Optional) �Ƿ���ȿ�¡ Ĭ��ֵfalse
	* @return	{element}					��¡���Ԫ��
	*/


	var NodeW=function(core) {
		if(!core) return null;
		var arg1=arguments[1];
		if(getType(core)=='string'){
			if(this instanceof NodeW){
				core=$(core,arg1);
				if(!core) return null;
				this[0]=this.core=$(core,arg1);
				this.length=1;
			}
			else return new NodeW(query(arg1,core));
		}
		else {
			core=$(core,arg1);
			if(this instanceof NodeW){
				this.core=core;
				if(getType(core)=='array'){
					this.length=0;
					push.apply( this, core );
				}
				else{
					this.length=1;
					this[0]=core;
				}
			}
			else return new NodeW(core);
		}
	};
	//NodeW.prototype = new QW.Wrap();
	var NodeA = {};
	mix(NodeA, HH.rwrap(NodeH2, NodeW, NodeC.wrapMethods));
	HH.gsetter(NodeA,NodeC.gsetterMethods)
	applyTo(NodeA, NodeW);							//NodeW�ľ�̬����
	methodizeTo(NodeA, NodeW.prototype, 'core');	//NodeW��ԭ�ͷ���
	NodeA=ObjectH.dump(QW.ArrayH,NodeC.arrayMethods);
	NodeA=HH.rwrap(NodeA, NodeW, NodeC.wrapMethods)
	applyTo(NodeA, NodeW);							//NodeW�ľ�̬����
	methodizeTo(NodeA, NodeW.prototype);	//NodeW��ԭ�ͷ���


	mix(NodeW.prototype,{
		/** 
		* ����NodeW�ĵ�0��Ԫ�صİ�װ
		* @method	first
		* @return	{NodeW}	
		*/
		first:function(){
			return NodeW(this[0]);
		},
		/** 
		* ����NodeW�����һ��Ԫ�صİ�װ
		* @method	last
		* @return	{NodeW}	
		*/
		last:function(){
			return NodeW(this[this.length-1]);
		},
		/** 
		* ����NodeW�ĵ�i��Ԫ�صİ�װ
		* @method	last
		* @param {int}	i ��i��Ԫ��
		* @return	{NodeW}	
		*/
		item:function(i){
			return NodeW(this[i]);
		}
	});


QW.$=QW.g=Dom.$;
QW.$$=QW.gg=NodeW.$;
QW.NodeW=QW.W=NodeW;
}();

