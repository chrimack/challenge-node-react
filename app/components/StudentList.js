import React from 'react';
import { connect } from 'react-redux';
import { fetchStudents } from '../actions/student';
import Student from './Student';

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      currentStudents: [],
      prev: false,
      next: null,
    };

    this.showNextPage = this.showNextPage.bind(this);
    this.showPrevPage = this.showPrevPage.bind(this);
  }

  // call to the db for current list of students
  componentDidMount() {
    this.props.fetchStudents();
  }

  componentDidUpdate(prevProps) {
    if (this.props.students.length !== prevProps.students.length) {
      this.setState({
        currentStudents: this.props.students.slice(0, 10),
        next: this.props.students.slice(10, 20),
      });
    }
  }

  // add new student to the list after added to the db
  componentWillReceiveProps(nextProps) {
    if (nextProps.newStudent) {
      this.props.students.unshift(nextProps.newStudent);
    }
  }

  showNextPage() {
    let { page, currentStudents, prev, next } = this.state;
    page = page + 1;
    prev = currentStudents;
    currentStudents = this.props.students.slice(page * 10 - 10, page * 10);
    next = this.props.students.slice(page * 10, page * 10 + 10);
    next = next.length ? next : null;

    this.setState({
      page,
      currentStudents,
      prev,
      next,
    });
  }

  showPrevPage() {
    let { page, currentStudents, prev, next } = this.state;
    page = page - 1;
    next = currentStudents;
    currentStudents = prev;
    prev = this.props.students.slice(page * 10 - 10, page * 10);
    prev = prev.length ? prev : null;

    this.setState({
      page,
      currentStudents,
      prev,
      next,
    });
  }

  render() {
    const students = this.state.currentStudents.map((student, i) => (
      <Student key={i} student={student} />
    ));

    return (
      <div className="col-md-9">
        <h3>Current Students</h3>
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{students}</tbody>
        </table>
        <div className="row">
          <div className="col-md-3 col-md-offset-9">
            {this.state.prev && (
              <button
                className="btn btn-default mx-1"
                onClick={this.showPrevPage}
              >
                Previous
              </button>
            )}
            {this.state.next && (
              <button
                className="btn btn-default mx-1"
                onClick={this.showNextPage}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    students: state.student.items,
    newStudent: state.student.item,
  };
};

export default connect(mapStateToProps, { fetchStudents })(StudentList);
