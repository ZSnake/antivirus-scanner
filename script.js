const albumBucketName = 'bucket-to-scan-spike';
const bucketRegion = 'us-east-2';

AWS.config.update({
  region: bucketRegion,
  accessKeyId: window.localStorage.getItem('accessId') || AWS_ACCESS,
  secretAccessKey: window.localStorage.getItem('secretKey') || AWS_SECRET
});

let logStreamName;
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

const cloudwatchlogs = new AWS.CloudWatchLogs({apiVersion: '2014-03-28'});

const pullCloudwatchLogs = () => {
  $('#log-status').html(`<span>Status: <b class="warning-status">Loading...</b></span>`);
  const logGroupName = '/aws/lambda/bucket-antivirus-function';
  $('#logs-container').html('');
  const logStreamsParams = {
    logGroupName,
    descending: true,
    orderBy: 'LastEventTime'
  };
  cloudwatchlogs.describeLogStreams(logStreamsParams, function(err, { logStreams }) {
    if (err) return console.log(err, err.stack);
    if(logStreamName !== logStreams[0].logStreamName) logStreamName = logStreams[0].logStreamName;
    const pullLogsParams = {
      logGroupName,
      logStreamName,
      startFromHead: true,
    };
    cloudwatchlogs.getLogEvents(pullLogsParams, function(err, data) {
      if (err) return console.log(err);
      data.events.forEach(event => {
        $('#logs-container').append(`<div>${event.message}</div>`);
      });
      $('#log-status').html(`<span>Status: <b class="success-status">Loaded</b></span>`);
    });
  });
}

const handleCloseAlert = () => {
  $('#alert-container').addClass('hide');
}

const handleFileUpload = () => {
  $('#upload-button').attr('disabled', 'disabled');
  $('#upload-button').html(`<i class="fa fa-spinner fa-spin"></i>`);
  const fileList = $('#file-input')[0].files;
  if (!fileList.length) {
    return alert('Please choose a file to upload first.');
  }
  const selectedFile = fileList[0];
  const fileName = selectedFile.name;

  s3.upload({
    Key: fileName,
    Body: selectedFile,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
       return console.log(err.message);
    }
    $('#alert-container').removeClass('hide');
    $('#upload-button').removeAttr('disabled');
    $('#upload-button').html(`<i class="fa fa-upload"></i> Upload`);
  });
}

$('document').ready(() => {
  $('#upload-button').on('click', handleFileUpload);
  $('#success-close').on('click', handleCloseAlert);
  pullCloudwatchLogs();
  setInterval(pullCloudwatchLogs, 30000);
});