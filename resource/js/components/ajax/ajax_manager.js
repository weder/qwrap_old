/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: chenminliang@baidu.com
 */
/**
 * @class Queue Ajax���й�����
 * @namespace QW.AjaxManager
 *
 */
(function(){
	/**
	 * @constructor
	 * @param {Number} type ����ִ�е�ģʽ
	 */
	function Queue(type){
		/**
		 * @property type ����ģʽ
		 * @type {Number}
		 */
		this.type = type;
		/**
		 * @property workers ��ǰ�����е���������
		 * @type {Array}
		 */
		this.workers = [];
		/**
		 * @property running ��ǰ���е�״̬
		 * @type {Boolean} 
		 */
		this.running = false;
	}

	QW.ObjectH.mix(Queue.prototype,{
		/**
		 * ����������Ajax����ÿ����Ӻ󶼻����work��ִ�ж���
		 * @method
		 * @param {Ajax} ajax Ajaxʵ��
		 */
		add: function(ajax){
			this.workers.push(ajax);
			switch(this.type){
				case 1:
					if( !this.running )
						this.work();
					break;
				case 2:
					if( this.workers.length > 1 )
						this.workers.shift().cancel();
					this.work();
					break;
			}
		},
		/**
		 * ִ�ж���
		 * @method
		 */
		work: function(){
			var len = this.workers.length;
			if( !len ) {
				this.running = false;
				return;
			}
			this.running = true;
			var ajax = this.workers[0];
			var me = this;
			switch(this.type){
				case 1:
					ajax.on('complete',function(){
						me.workers.shift();
						me.work();
					});
					break;
			}
			ajax.request();
		}
	});
	/**
	 * @property types ����ģʽ<br>LINE:˳��ķ�������ÿ��������ǰһ�����������ŷ���;<br>DROP:�µ������ڷ���ǰ������ֹ�ɵ�δ��ɵ�����
	 * @type {Object}
	 */		
	Queue.types = {
		//˳��ķ�������ÿ��������ǰһ�����������ŷ���
		LINE:	1,
		//�µ������ڷ���ǰ������ֹ�ɵ�δ��ɵ�����
		DROP:	2
	};
	QW.provide('AjaxManager',{});
	QW.AjaxManager.Queue = Queue;
})();