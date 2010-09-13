/*
 *	Copyright (c) 2009, Baidu Inc. All rights reserved.
 *	http://www.youa.com
 *	version: $version$ $release$ released
 *	author: chenminliang@baidu.com
 */
/**
 * @class Queue Ajax队列管理器
 * @namespace QW.AjaxManager
 *
 */
(function(){
	/**
	 * @constructor
	 * @param {Number} type 队列执行的模式
	 */
	function Queue(type){
		/**
		 * @property type 队列模式
		 * @type {Number}
		 */
		this.type = type;
		/**
		 * @property workers 当前队列中的所有任务
		 * @type {Array}
		 */
		this.workers = [];
		/**
		 * @property running 当前队列的状态
		 * @type {Boolean} 
		 */
		this.running = false;
	}

	QW.ObjectH.mix(Queue.prototype,{
		/**
		 * 向队列中添加Ajax任务，每次添加后都会调用work来执行队列
		 * @method
		 * @param {Ajax} ajax Ajax实例
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
		 * 执行队列
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
	 * @property types 队列模式<br>LINE:顺序的发送请求，每个请求在前一个请求结束后才发送;<br>DROP:新的请求在发送前，会终止旧的未完成的请求
	 * @type {Object}
	 */		
	Queue.types = {
		//顺序的发送请求，每个请求在前一个请求结束后才发送
		LINE:	1,
		//新的请求在发送前，会终止旧的未完成的请求
		DROP:	2
	};
	QW.provide('AjaxManager',{});
	QW.AjaxManager.Queue = Queue;
})();