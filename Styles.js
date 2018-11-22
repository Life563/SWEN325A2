import {StyleSheet} from 'react-native';

////////////////////////////////////////////////////////////////
/////////////////////// Style Sheets ///////////////////////////
////////////////////////////////////////////////////////////////

/**
 * Light Styling Sheet
 */
const lightStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 25,
    paddingBottom: 25
  },
  scrollView:{
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
  },
  h1: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000000',
    margin: 10,
  }, 
  header: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    margin: 10,
  },
  main: {
    textAlign: 'center',
    color: '#000000',
    marginBottom: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#000000',
  }, actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

/**
 * Dark Styling Sheet
 */
const darkStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1d2126',
    padding: 25,
    paddingBottom: 25
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    color: '#FFFFFF',
    margin: 10,
  },
  scrollView:{
    backgroundColor: '#1d2126'
  },
  h1: {
    fontSize: 25,
    textAlign: 'center',
    color: '#FFFFFF',
    margin: 10,
  }, 
  header: {
    fontSize: 25,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#1d2126',
    marginBottom: 5,
    margin: 10,
  },
  main: {
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#1d2126',
    marginBottom: 5,
  },
  item: {
    color: '#FFFFFF',
    backgroundColor: '#1d2126',
    padding: 10,
    fontSize: 18,
    height: 44,
  }, actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

// Add Styles to exports
module.exports = {lightStyle: lightStyle, darkStyle: darkStyle};