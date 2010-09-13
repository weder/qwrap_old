#!/bin/bash
#此脚本用于静态页面文件整体送测打包
#please modify this script adapting to your module!
#获取程序名和当前目录名
progname=`basename $0`
dirname=`pwd`
modulename=`basename $dirname`
foldertype="youa-php"
folderpath="youa-php/page"
projectname="sp"

#检查是否有jx的链接
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
NEED=0   #需要对文件加密设置为1，不需则为0
#delete CVS folders

#获取指定版本和/或Tag文件，跨模块和版本合并脚本要用
#cvs co -r item_1-0-9-3_PD_BL eb/wed/webapp/script/mall/item/item_detail.js
#mv eb/wed/webapp/script/mall/item/item_detail.js $module_enc/item_detail.js
#rm -rf eb
#

find ./ -type d -name .svn|xargs -i rm -rf {}   #提前删除SVN管理目录

[ -e make.pl ] && perl make.pl .		#查找配置脚本make.pl，如果存在，则运行该脚本 

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
#判断是否可删除output目录
[ -e $module_enc/output/$filename ] && rm -f $module_enc/output/$filename
if [ ! -e $module_enc/output/* ]; then
	rm -rf $module_enc/output
else
	echo "请不要在模块中添加output目录并提交文件，如果已提交文件，请申请cvs后台删除操作。"
fi

#[ -e $module_enc/make.pl ] && perl $module_enc/make.pl	$module_enc		#查找配置脚本make.pl，如果存在，则运行该脚本 
rm -rf .tmp

#打包成mall-php
mkdir -p .tmp/$folderpath
cp -r $modulename .tmp/$folderpath

[ -e .tmp/$folderpath/$modulename/compress_file.pl ] && rm -r .tmp/$folderpath/$modulename/compress_file.pl 
[ -e .tmp/$folderpath/$modulename/make.pl ]  && rm .tmp/$folderpath/$modulename/make.pl
[ -e .tmp/$folderpath/$modulename/make.ini ]  && rm .tmp/$folderpath/$modulename/make.ini
[ -e .tmp/$folderpath/$modulename/yuicompressor-2.3.5.jar ]  && rm .tmp/$folderpath/$modulename/yuicompressor-2.3.5.jar

#是否存在css、js等静态资源，需要生成htdocs目录
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

#历史问题目录名不能有"_",所以要处理。。 
#[[ "${modulename/com-/}" != "$modulename" ]] && mv .tmp/$folderpath/$modulename .tmp/$folderpath/$(echo $modulename|sed 's/com-/_/')

#打tar包排除文件功能，如果想排除其他文件或目录在$module_enc前加"--exclude $module_enc/目录名/文件名"即可。
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
	find .tmp/htdocs/ -type d -name _*|xargs -i rm -rf {}	#提前删除js|css|static里一切以_开头的目录	
fi

RETVAL=$?
[ $RETVAL -gt 0 ] && echo "tar failed!" && exit $RETVAL
[ $NEED -eq 1 ] && rm -rf $module_enc #只对加密情况下删除此目录
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
