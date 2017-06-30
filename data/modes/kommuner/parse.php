<?php
    $urls = explode("\n",file_get_contents('url.txt'));
    
    foreach($urls as $url){
        $filename = urldecode(basename($url));
        file_put_contents($filename, fopen($url, 'r'));
    }