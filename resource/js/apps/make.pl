#! /user/bin/perl

#提测时用来读取配置文件
#make.ini
use strict;

my $path = @ARGV[0] || ".";
my $config = $path."/make.ini";


open(CONF, $config) || die "Fail to read make.ini (in make.pl).\n";

my @pattern;

while(<CONF>){
	my $i = $_;
	if(!/^\s+$/ && !/^#/){
		chomp($i);
		
		my ($c, $p) = split(" ", $i);
		
		$p =~ s/\./\\\./g;
		$p =~ s/\*/[^\/]\*/g;
		$p =~ s/\?/[^\/]/g;
		$p =~ s/\/\//\/.*\//g;
		$p =~ s/^~\//~/g;
		$p =~ s/^\///g;
		my @pa = {
			"c" => $c,
			"p" => $p
		};

		push(@pattern,@pa);
	}
}

close(CONF);

print "go...\n";

#检查并处理文件及目录

sub parse_env{
	my($path) = @_;
	my $subpath;
	my $handle;
	my $f = 0;

	if(-d $path){
		if(opendir($handle, $path)) {
			while($subpath = readdir($handle)) {
				if(!($subpath =~ m/^\.$/) and !($subpath =~ m/^(\.\.)$/)) {	#排除特殊路径 . 与 ..
					my $p = $path."/$subpath";
					if(-d $p) {			#如果是目录
						$f+=parse_env($p);	#递归执行
					}
					else{
						$f+=parseFile($p);	#对文件进行处理
					}
				}
			}
			closedir($handle);
			if($f == 0){		#删除空的目录(0资源)
				print "clear ".$path."\n";
				rmdir($path)
			}
		}
	}
	return $f;
}


sub parseFile {
	my($file) = @_;
	my $f = 0;
	my $pa;

	if(($file eq $path."/make.pl") or ($file eq $path."/make.ini") or ($file eq $path."/build.sh") or ($file eq $path."/yuicompressor-2.3.5.jar")){ 
		return	1;	#文件被保留
	}
	foreach $pa (@pattern) {

		#得到每一个有效的pattern
		my $c = $pa -> {c};
		my $p = $pa -> {p};
		my $t = 0;

		if($p =~ s/^~// && !($file =~ /^($path\/)?$p$/)){
			$t = 1;
		}
		elsif($file =~ /^($path\/)?$pa->{p}$/){
			$t = 1;
		}
		
		if($t){
				if($c eq "-e"){
				#排除符合指定模式的文件
				print "exclude ".$file."\n";
				unlink($file);
				return 0;	#文件已经被删除，返回0
			}
			elsif($c eq "-c"){
				#压缩符合指定模式的js文件
				print "perl $path/compress_file.pl ".$file." ".$path."\n";
				system "perl $path/compress_file.pl ".$file." ".$path;
			}
		}
	}
	return 1;	#文件被保留
}

parse_env $path;
exit(0);
