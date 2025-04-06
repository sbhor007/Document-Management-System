<html>
   <body>
       <form action='<?php echo $_SERVER["PHP_SELF"]; ?>' method = 'post'>
	   <h1>Student Infoemation</h1>
	   Roll No : <input type = 'number' name = 'rno'><br><br>
	   Name : <input type = 'text' name = 'name'><br><br>
	   PRN : <input type = 'text' name = 'prn'><br>
	   <h3>Enter Marks</h3>
	   PHP : <input type = 'text' name = 'php'><br><br>
	   OS : <input type = 'text' name = 'os'><br><br>
	   C++ : <input type = 'text' name = 'cpp'><br><br>
	   CN : <input type = 'text' name = 'cn'><br><br>
	   <input type = 'submit' name = 'sub' value = 'Calculate Result'><br>
       </form>
   </body>
</html>

<?php

/*
 Create a class Student with data members Roll No, Name, PRN number. Derive class Marks from
student with data members M_ PHP,M OS, M _ CPP, M Networking and derive a class Result from 
class
Marks with members (Total Marks, Percentage, Grade). (Use Interface Concept)
Write a Menu driven program in PHP to perform the following operations
i. Accept Student Information
ii. Display Student Information with its result.
*/

interface Information
{
	public function display();
}
class student implements Information
{
	protected $roll_no,$name,$prn;
	public function __construct($roll_no,$name,$prn)
	{
		$this->roll_no = $roll_no;
		$this->name = $name;
		$this->prn = $prn;
		

	}
	public function display(){
		echo "<br>Roll No : $this->roll_no";
		echo "<br>Name : $this->name";
		echo "<br>PRN : $this->prn";
		
	}
}
class marks extends student
{
	protected $m_php,$m_os,$m_cpp,$m_cn;
	public function __construct($roll_no,$name,$prn,$m_php,$m_os,$m_cpp,$m_cn)
	{
		parent::__construct($roll_no,$name,$prn);
		$this->m_os = $m_os;
		$this->m_php = $m_php;
		$this->m_cpp = $m_cpp;
		$this->m_cn = $m_cn;
	}
	public function display_marks()
	{
		parent::display();
		echo "<br> Marks : <br>os : $this->m_os";
		echo "<br>php : $this->m_php";
		echo "<br>cpp : $this->m_cpp";
		echo "<br>CN : $this->m_cn";
	}
} 

class result extends marks
{
	protected $total_marks,$percentage,$grade;
	public function __construct($roll_no,$name,$prn,$m_php,$m_os,$m_cpp,$m_cn)
	{
		parent::__construct($roll_no,$name,$prn,$m_php,$m_os,$m_cpp,$m_cn);
	}
	private function cal_total()
	{
		 return $this->m_php + $this->m_os + $this->m_cpp + $this->m_cn;
	}
	private function cal_percentage(){
		$this->total_marks = $this->cal_total();
		return ($this->total_marks / 4);
	}
	private function cal_grade()
	{
		$this->percentage = $this->cal_percentage();
		if($this->percentage > 75 && $this->percentage <=100)
		{
			return 'A+';
		}else if($this->percentage <= 75 && $this->percentage > 60)
		{
			return 'A';
		}else if($this->percentage <=60 && $this->percentage > 50)
		{
			return 'B';
		}else if($this->percentage <= 50 && $this->percentage > 40)
		{
			return 'C';
		}else if($this->percentage <= 40)
		{
			return 'F';
		}else{
			return -1;
		}
	}
	public function display_result()
	{
		$this->display_marks();
		{
			$this->grade = $this->cal_grade();
			echo "<br>Total Marks : $this->total_marks";
			echo "<br>Percentage : $this->percentage";
			echo "<br>Grade : $this->grade";
		}
	}
}

if(isset($_POST['sub']))
{
	$rno = $_POST['rno'];
	$name = $_POST['name'];
	$prn = $_POST['prn'];
	$php = $_POST['php'];
	$os = $_POST['os'];
	$cpp = $_POST['cpp'];
	$cn = $_POST['cn'];


	$s1 = new result($rno,$name,$prn,$php,$os,$cpp,$cn);
	$s1->display_result();
}


?>