#! /user/bin/perl

#提测时用来压缩文件
use strict;

my $file = @ARGV[0] || die("Arguments error!");
my $path = @ARGV[1] || die("Arguments error!");
#my @cmd = ("java ","copy ","del "); #for windows
my @cmd = ("gij ","cp ","rm "); #for linux(icafe)
my $compressor = $path."/yuicompressor-2.3.5.jar";

#修正windows下的路径
sub fixPATH{
	my($file) = @_;
	if(@cmd[1] eq "copy "){
		$file =~ s/\//\\\\/
	}
	return $file;
}

#处理需要引入或合并的文件
sub dealImport{
	my ($t,$in,$out) = @_;

	my $type = "js";
	if($in =~ /\.css\s*$/){
		$type = "css";
	};
	
	if($out eq ""){
		$in =~s/\n//g;
		$out = "tempfile_out.tmp.".$type;
	}
	my $cmd;
	if(@cmd[2] eq "del "){
		$cmd = "copy /b ".$in." ".$out;
	}else{
		$cmd = "cat ".$in." > ".$out;
	}
	print $cmd."\n";
	system $cmd; 
	
	my $ret = "";
	compressFile($out, $type);
	if($out =~ /^tempfile_out\.tmp\./){
		open(IMPORT, $out);
		while(<IMPORT>){
			s/\\\\\/script/\/script/g;
			$ret .= $_;
		}
		close(IMPORT);
		system @cmd[2].$out;
	}
	return $ret;
}

#用yui压缩指定文件
sub compressFile{
	my ($file, $type) = @_;

	my $tmp = $file."_tmp";

	print @cmd[0]."-jar ".$compressor." --type ".$type." --preserve-semi ".$file." -o ".$tmp."\n";
	system @cmd[0]."-jar ".$compressor." --type ".$type." --preserve-semi ".$file." -o ".$tmp;
	
	my $ret="";

	open(TMP,$tmp);
	open(OUT,">".$file);
	while(<TMP>){
		s/\\\\\/script/\/script/g;
		$ret.=$_;
		print OUT;
	}
	$ret.="\n";
	print OUT "\n";
	close(OUT);
	close(TMP);
	
	#删掉临时文件
	system @cmd[2].$tmp;

	return $ret;
}

#预处理
sub preDeal{
	my ($file) = @_;

	my $type = "js";
	if($file =~ /\.css$/){
		$type = "css";
	};

	my $pre = $file."_predeal";
	my $tmp = "";

	open(PIN, $file);
	open(POUT, ">".$pre);

	my $compressTag = 0;
	my $ignoreTag = 0;
	while(<PIN>){
		if(/{{start:import/){	#合并、引入文件
			my @arr = split(/>/g);
			print POUT dealImport(@arr);
			next;
		}elsif(/}}end:import/){
			next;
		}
		if(/{{start:ignore/){
			$ignoreTag = 1;
			next;
		}
		elsif(/}}end:ignore/){
			$ignoreTag = 0;
			next;
		}
		if($ignoreTag){
			next;
		}
		if(/{{start:compress(\s+(\w+))?/){			#要压缩
			my $type = $2 || "css";
			$tmp = $file."_tmp_file.".$type;
			$compressTag = 1;
			open(PTMP,'>'.$tmp);
			next;
		}		
		elsif(/}}end:compress/){
			close(PTMP);
			$compressTag = 0;
			print POUT compressFile($tmp, $type);
			system @cmd[2].$tmp;
			next;
		}		
		if($compressTag){
			print PTMP;
		}else{
			print POUT;
		}
	}
	close(PIN);
	close(POUT);

	system @cmd[1].$pre." ".$file;
	system @cmd[2].$pre;
}

$file = fixPATH($file);				#修正路径（兼容windows）
$compressor = fixPATH($compressor);	

#直接压缩脚本文件
if($file =~ /\.js$/){
	#先进行预处理
	preDeal($file);

	#压缩符合指定模式的文件
	compressFile($file,"js");
}
elsif($file =~ /\.css$/){
	#先进行预处理
	preDeal($file);

	#压缩符合指定模式的文件
	compressFile($file,"css");
}
#压缩其中的一部分 //--use compressor ... //--end use
else{
	preDeal($file);
}