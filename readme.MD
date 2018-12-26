# Antivirus/Antimalware Scanner

This project will communicate with an public S3 bucket, upload a file and that will trigger a lambda function that will scan the recently uploaded file (the lambda function is triggered for each file created). ClamAV will scan the file and flag it as `CLEAN` or `INFECTED`.

### Instructions to test
To test *any* file, we first need to set up our authentication method for our AWS-SDK. Since this is a static webpage, we'll set this up in our `localStorage`. For that we'll need to:
1. Go to [this page](https://file-scanner.herokuapp.com/index.html) Open Chrome DevTools
2. Go to the `Application` tab.
3. On the left menu, select `Local Storage` and select the `file-scanner` heroku application under it
4. Add the key/value pairs for `accessId` and `secretKey` (which will be provided privately by me).
5. Once the authentication methods are done, refresh the webpage
6. Click the `Browse` button to select a file
7. To test a `CLEAN` file, select any file from your computer and click `Upload` (the upload might take a while).
8. Once the file is uploaded you'll start seeing new entries in the logs. These logs are updated every 30 seconds, it will _always_ pick up the last log stream for the `/aws/lambda/bucket-antivirus-function` log group which refers to our AntiMalware scanner function.
9. Wait until the entrie for the file you uploaded shows up in the logs and determine if it was scanned correctly. You should see something similar to:
```----------- SCAN SUMMARY -----------
Known viruses: 6748100
Engine version: 0.100.2
Scanned directories: 0
Scanned files: 1
Infected files: 0
Data scanned: 1.11 MB
Data read: 1.10 MB (ratio 1.01:1)
Time: 23.914 sec (0 m 23 s)

Scan of s3://bucket-to-scan-spike/herokutest.png resulted in CLEAN```


10. To test an *infected* file, go to the [European Group for IT Security webpage and download their Antimalware test file](https://www.eicar.org/?page_id=3950). This file in any format will be detected as infected without risking your computer.
11. Once you've used this you should see a similar scan as above, but with `INFECTED` as result instead.

### Useful links
The lambda function that does all the work is in [this repository](https://github.com/ZSnake/bucket-antivirus-function) and is a forked based off of [this repository](https://github.com/upsidetravel/bucket-antivirus-function). A fork was made due to some errors being fixed by installing a couple packages in build time.

This project is deployed and usable at [this address](https://file-scanner.herokuapp.com/index.html) or can be cloned and used locally.

![screenshot](https://i.imgur.com/tuRBFPH.png)
