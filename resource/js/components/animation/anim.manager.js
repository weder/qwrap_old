(function() {
	var CustEvent = QW.CustEvent;
	var Effect=function(eftFun,dur,opts){
		this.eftFun=eftFun;
		this.dur=dur;
		this.opts=opts;
		this.isPlaying=false;
		this._startDate=0;
		this._costDur=null;
		CustEvent.createEvents(this,"play,beforeplay,stop,pause,resume,suspend,reset");
		return this;
	}
	
	Effect._fps = 28;
	/**
	 * ����������
	 */
	Effect._interval=window.setInterval("QW.Effect._playAll()",Effect._fps);

	/**
	 *���ڲ��ŵĶ��� 
	 */
	Effect._playingObjs=[];

	/**
	 *���������������ڲ��ŵĶ��� 
	 */
	Effect._playAll=function(){
		for(var i=0;i<Effect._playingObjs.length;i++){
			var ef=Effect._playingObjs[i];
			var now=new Date();
			ef._startDate||(ef._startDate=now);
			var per=(now-ef._startDate)/ef.dur;
			if(per>=1) {
				per=1;
				ef.eftFun(1);
				ef.fire("play");
				ef.fire("suspend");
				ef._costDur=null;
				ef.isPlaying=false;
				Effect._playingObjs.splice(i,1);
				i--;
			}
			else {
				ef.eftFun(per);
				ef.fire("play");
			}
		}
	}

	/**
	 *��ʼ���� 
	 */
	Effect.prototype.play = function(){
		var idx=Effect._playingObjs.indexOf(this);
		if(idx>-1) this.stop();
		this._startDate=0;
		Effect._playingObjs.push(this);
		this.fire("beforeplay");
		this.isPlaying=true;
	}

	/**
	 *ֹͣ���� 
	 */
	Effect.prototype.stop = function(){
		var idx=Effect._playingObjs.indexOf(this);
		if(idx>-1) Effect._playingObjs.splice(idx,1);
		this._startDate=0;
		this._costDur=null;
		this.isPlaying=false;
		this.fire("stop");
	}

	/**
	 *���ŵ���� 
	 */
	Effect.prototype.suspend = function(){
		var idx=Effect._playingObjs.indexOf(this);
		if(idx>-1) Effect._playingObjs.splice(idx,1);
		this.eftFun(1);
		this.fire("suspend");
		this.isPlaying=false;
	}

	/**
	 *��ͣ���� 
	 */
	Effect.prototype.pause = function(){
		var idx=Effect._playingObjs.indexOf(this);
		if(idx>-1) {
			this._costDur=new Date()-this._startDate;
			Effect._playingObjs.splice(idx,1);
			this.fire("pause");
		}
	}

	/**
	 *�������� 
	 */
	Effect.prototype.resume = function(){
		var idx=Effect._playingObjs.indexOf(this);
		if(idx<0) {
			if(this._costDur==null) return;
			this._startDate=new Date()-this._costDur;
			Effect._playingObjs.push(this);
			this.fire("resume");
		}
	}
	/**
	 *���ŵ��ʼ 
	 */
	Effect.prototype.reset = function(){
		this._startDate=new Date();
		this.costDur=null;
		this.eftFun(0);
		this.fire("reset");
	}
	
	QW.Effect = Effect;
})();