import { connect, ConnectedProps } from 'react-redux';

import PageContainer from '../components/PageContainer';

interface RootState {
    darkMode: boolean
}
  
const mapStateToProps = (state: RootState) => ({
    darkMode: state.darkMode
})

const connector = connect(mapStateToProps, {})
  
export type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(PageContainer)