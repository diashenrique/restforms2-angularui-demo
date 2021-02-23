Class User.forms.TaskForm Extends (%Persistent, dc.irisrad.FormAdaptor) [ Inheritance = right, Not ProcedureBlock ]
{

Property text As %Library.String(%JSONINCLUDE = "INOUT", %JSONREFERENCE = "ID", DISPLAYNAME = "Task name");

Property taskDate As %Library.TimeStamp(%JSONINCLUDE = "INOUT", %JSONREFERENCE = "ID", DISPLAYNAME = "Task date");

Property important As %Library.Boolean(%JSONINCLUDE = "INOUT", %JSONREFERENCE = "ID", DISPLAYNAME = "Important");

Property completed As %Library.Boolean(%JSONINCLUDE = "INOUT", %JSONREFERENCE = "ID", DISPLAYNAME = "Completed");

Parameter DISPLAYPROPERTY = "text";

Parameter FORMNAME = "FormTest";

Parameter OBJPERMISSIONS = "CRUD";

Parameter ToolbarUIDef = "User.forms.TestForm||toolbarTestFormUI";

Storage Default
{
<Data name="TaskFormDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>text</Value>
</Value>
<Value name="3">
<Value>taskDate</Value>
</Value>
<Value name="4">
<Value>important</Value>
</Value>
<Value name="5">
<Value>completed</Value>
</Value>
</Data>
<DataLocation>^User.forms.TaskFormD</DataLocation>
<DefaultData>TaskFormDefaultData</DefaultData>
<IdLocation>^User.forms.TaskFormD</IdLocation>
<IndexLocation>^User.forms.TaskFormI</IndexLocation>
<StreamLocation>^User.forms.TaskFormS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
