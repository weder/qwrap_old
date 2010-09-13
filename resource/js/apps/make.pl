#! /user/bin/perl

#���ʱ������ȡ�����ļ�
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

#��鲢�����ļ���Ŀ¼

sub parse_env{
	my($path) = @_;
	my $subpath;
	my $handle;
	my $f = 0;

	if(-d $path){
		if(opendir($handle, $path)) {
			while($subpath = readdir($handle)) {
				if(!($subpath =~ m/^\.$/) and !($subpath =~ m/^(\.\.)$/)) {	#�ų�����·�� . �� ..
					my $p = $path."/$subpath";
					if(-d $p) {			#�����Ŀ¼
						$f+=parse_env($p);	#�ݹ�ִ��
					}
					else{
						$f+=parseFile($p);	#���ļ����д���
					}
				}
			}
			closedir($handle);
			if($f == 0){		#ɾ���յ�Ŀ¼(0��Դ)
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
		return	1;	#�ļ�������
	}
	foreach $pa (@pattern) {

		#�õ�ÿһ����Ч��pattern
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
				#�ų�����ָ��ģʽ���ļ�
				print "exclude ".$file."\n";
				unlink($file);
				return 0;	#�ļ��Ѿ���ɾ��������0
			}
			elsif($c eq "-c"){
				#ѹ������ָ��ģʽ��js�ļ�
				print "perl $path/compress_file.pl ".$file." ".$path."\n";
				system "perl $path/compress_file.pl ".$file." ".$path;
			}
		}
	}
	return 1;	#�ļ�������
}

parse_env $path;
exit(0);
