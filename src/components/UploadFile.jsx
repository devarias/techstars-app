import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVReader } from 'react-papaparse';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import '../styles/UploadFile.css';
/**
 * UploadFile is the component to upload the CSV to generate the schedule
 * @setReschedule: this setter sends the response schedule data from the back-end to
 * be used to
 * build the datatable.
 * @setView: is used to redirect automatically from the generate meeting section to
 * the meeting table view
 */
const UploadFile = ({ setRechargeMeetings, setView }) => {
  /* isReset manages the unmounting process for the uploaded CSV file*/
  const [isReset, setIsReset] = useState(false);
  /* jsonData stores the data of the uploaded CSV */
  const [jsonData, setJsonData] = useState(null);
  /* fetched is used to know when the the generation of the schedule is done to redirect
   * the user to the scheduling table */
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(0);
  const message = [
    'Drop CSV file here or click to upload',
    'Generating schedule.\nPlease wait to be redirected...',
  ];
  const history = useHistory();

  /* This effect redirects from this component to the table schedule view and cleans 
  this component*/
  useEffect(() => {
    if (fetched === true) {
      history.push('/MeetingsTable');
      setRechargeMeetings(true);
      setView(4);
    }
    return () => {};
  }, [fetched]);

  /* This funtions handles the actions when a CSV file is uploaded */
  const handleOnDrop = (data) => {
    const data_list = data.map((row) => row.data);
    setJsonData(JSON.stringify(data_list));
  };

  /* This function handles Error with the uploaded file */
  const handleOnError = (err, file, inputElem, reason) => {
    alert(err);
    setIsReset(true);
    setJsonData(null);
    alert('Error: %s', reason);
  };

  /* Removes the file from the front-end to allow the upload of another file 
  or when an error ocurred */
  const handleOnRemoveFile = (data) => {
    setIsReset(true);
    setJsonData(null);
  };

  /* Handles the querying to the back-end to generate the shedule*/
  const handleSubmit = () => {
    if (jsonData !== null) {
      if (
        window.confirm(
          'A new meeting schedule is going to be generated\nand the actual schedule will be erased permanently\nDo you want to continue?'
        )
      ) {
        setIsReset(true);
        setLoading(1);
        fetch(
          'https://techstars-api.herokuapp.com/api/schedule' /* Route to send the CSV file to 
                                                    generate the schedule */,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: jsonData,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            /*result is the generated schedule without conflicts*/
            //setResSchedule(result);
            setIsReset(true);
            /* with this we call the use effect to redirect to other component and clean
              the actual component */
            setFetched(true);
          })
          .catch((error) => {
            setIsReset(true);
            setJsonData(null);
            console.error('Error:', error);
          });
      } else {
        setIsReset(true);
      }
    }
  };

  const handleSubmitButton = () => {
    if (jsonData !== null) {
      return (
        <Button
          id='buttonUpload'
          type='primary'
          shape='round'
          icon={<SendOutlined />}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      );
    }
  };
  return (
    <>
      <CSVReader
        className='boxCsvParser'
        accept='text/csv, .csv, application/vnd.ms-excel'
        progressBarColor='#39C463'
        onDrop={handleOnDrop}
        onError={handleOnError}
        s
        addRemoveButton
        isReset={isReset}
        onRemoveFile={handleOnRemoveFile}
        config={{ header: true }}
        style={{
          dropArea: {
            borderColor: 'pink',
            height: 200,
            width: 400,
            borderRadius: 20,
          },
          dropAreaActive: {
            borderColor: 'red',
          },
          dropFile: {
            width: 100,
            height: 100,
            background: '#ccc',
          },
          fileSizeInfo: {
            color: '#000',
            backgroundColor: '#fff',
            borderRadius: 3,
            lineHeight: 1,
            marginBottom: '0.5em',
            padding: '0 0.4em',
          },
          fileNameInfo: {
            color: '#000',
            backgroundColor: '#fff',
            borderRadius: 3,
            fontSize: 14,
            lineHeight: 1,
            padding: '0 0.4em',
          },
          removeButton: {
            color: '#39C463',
          },
          progressBar: {
            backgroundColor: '#39C463',
          },
        }}
      >
        <span>{message[loading]}</span>
      </CSVReader>
      {handleSubmitButton()}
    </>
  );
};

export default UploadFile;
