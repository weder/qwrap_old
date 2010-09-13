#!/bin/bash
#�˽ű����ھ�̬ҳ���ļ������Ͳ���
#please modify this script adapting to your module!
#��ȡ�������͵�ǰĿ¼��
progname=`basename $0`
dirname=`pwd`
modulename=`basename $dirname`
foldertype="youa-php"
folderpath="youa-php/page"
projectname="sp"

#����Ƿ���jx������
check=$(echo $(grep 'http://jx-' * */* -c |sed 's/^.*://' | awk '{sum +=$1}END {print sum}'))
[[ $check != 1 ]] && echo "check failed" && exit 0

svnpath=$(cat .svn/all-wcprops | sed '/\/ver/!d' |sed -n '1p'| sed 's/.*!svn\/ver\/[^/]*//')
#echo $svnpath

[[ "${svnpath/resource\/css/}" != "$svnpath" ]] && foldertype="htdocs" && folderpath="htdocs/resource/css"
[[ "${svnpath/resource\/script/}" != "$svnpath" ]] && foldertype="htdocs" && folderpath="htdocs/resource/script"
[[ "${svnpath/resource\/static/}" != "$svnpath" ]] && foldertype="htdocs" && folderpath="htdocs/resource/static"
#echo $folderpath

[[ "${svnpath/\/sp\//}" != "$svnpath" ]] && projectname="sp"
[[ "${svnpath/\/sp-mis\//}" != "$svnpath" ]] && projectname="sp-mis"
#echo $projectname

#need encode or not ( 1 or 0)  NEED CHANGE
NEED=0   #��Ҫ���ļ���������Ϊ1��������Ϊ0
#delete CVS folders

#��ȡָ���汾��/��Tag�ļ�����ģ��Ͱ汾�ϲ��ű�Ҫ��
#cvs co -r item_1-0-9-3_PD_BL eb/wed/webapp/script/mall/item/item_detail.js
#mv eb/wed/webapp/script/mall/item/item_detail.js $module_enc/item_detail.js
#rm -rf eb
#

find ./ -type d -name .svn|xargs -i rm -rf {}   #��ǰɾ��SVN����Ŀ¼

[ -e make.pl ] && perl make.pl .		#�������ýű�make.pl��������ڣ������иýű� 

cd ..
#encode if this module NEED and encode target file folder
if [ $NEED -eq 1 ]; then
	module_enc=$modulename"_enc"
	filename=${module_enc}.tar.gz
        /usr/local/Zend/bin/zendenc --recursive --silent $modulename $module_enc
        RETVAL=$?
        [ $RETVAL -gt 0 ] && echo "zend encode failed!" && exit $RETVAL
else
	module_enc=$modulename
	filename=${modulename}_src.tar.gz
fi
#�ж��Ƿ��ɾ��outputĿ¼
[ -e $module_enc/output/$filename ] && rm -f $module_enc/output/$filename
if [ ! -e $module_enc/output/* ]; then
	rm -rf $module_enc/output
else
	echo "�벻Ҫ��ģ�������outputĿ¼���ύ�ļ���������ύ�ļ���������cvs��̨ɾ��������"
fi

#[ -e $module_enc/make.pl ] && perl $module_enc/make.pl	$module_enc		#�������ýű�make.pl��������ڣ������иýű� 
rm -rf .tmp

#�����mall-php
mkdir -p .tmp/$folderpath
cp -r $modulename .tmp/$folderpath

[ -e .tmp/$folderpath/$modulename/compress_file.pl ] && rm -r .tmp/$folderpath/$modulename/compress_file.pl 
[ -e .tmp/$folderpath/$modulename/make.pl ]  && rm .tmp/$folderpath/$modulename/make.pl
[ -e .tmp/$folderpath/$modulename/make.ini ]  && rm .tmp/$folderpath/$modulename/make.ini
[ -e .tmp/$folderpath/$modulename/yuicompressor-2.3.5.jar ]  && rm .tmp/$folderpath/$modulename/yuicompressor-2.3.5.jar

#�Ƿ����css��js�Ⱦ�̬��Դ����Ҫ����htdocsĿ¼
has_static=0

if [ -e .tmp/$folderpath/$modulename/js/* ]; then
	jspath=".tmp/htdocs/$projectname/$modulename"
	echo $jspath
	mkdir -p $jspath
	mv .tmp/$folderpath/$modulename/js $jspath
	has_static=1
fi

if [ -e .tmp/$folderpath/$modulename/css/* ]; then
	csspath=".tmp/htdocs/$projectname/$modulename"
	echo $csspath
	mkdir -p $csspath
	mv .tmp/$folderpath/$modulename/css $csspath
	has_static=1
fi

rm .tmp/$folderpath/$modulename/$progname

pwd

#��ʷ����Ŀ¼��������"_",����Ҫ������ 
#[[ "${modulename/com-/}" != "$modulename" ]] && mv .tmp/$folderpath/$modulename .tmp/$folderpath/$(echo $modulename|sed 's/com-/_/')

#��tar���ų��ļ����ܣ�������ų������ļ���Ŀ¼��$module_encǰ��"--exclude $module_enc/Ŀ¼��/�ļ���"���ɡ�
if [[ "${foldertype/htdocs/}" != "$foldertype" ]]; then
	tar zcf $filename -C .tmp htdocs
else
	if [ $has_static -eq 0 ]; then
		tar zcf $filename -C .tmp youa-php
	else
		tar zcf $filename -C .tmp youa-php htdocs
	fi
fi

if [  -e .tmp/htdocs/* ]; then
	find .tmp/htdocs/ -type d -name _*|xargs -i rm -rf {}	#��ǰɾ��js|css|static��һ����_��ͷ��Ŀ¼	
fi

RETVAL=$?
[ $RETVAL -gt 0 ] && echo "tar failed!" && exit $RETVAL
[ $NEED -eq 1 ] && rm -rf $module_enc #ֻ�Լ��������ɾ����Ŀ¼
if [ ! -d $modulename/output ];then
	mkdir $modulename/output 
	RETVAL=$?
	[ $RETVAL -gt 0 ] && echo "create output folder failed!"  && exit $RETVAL
fi
mv $filename $modulename/output
RETVAL=$?
[ $RETVAL -gt 0 ] && echo "mv files failed!" && exit $RETVAL
[ ! -e $modulename/output/$filename ] && echo "build failed!" && exit 1echo "build success!"
exit 0
