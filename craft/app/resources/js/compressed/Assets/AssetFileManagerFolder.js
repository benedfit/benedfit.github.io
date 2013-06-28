/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */
Assets.FileManagerFolder=Garnish.Base.extend({init:function(c,a,e,b){this.fm=c;this.li=a;this.depth=e;this.parent=b;this.$li=$(this.li);this.$a=$("> a",this.$li);this.$toggle;this.$ul;this.id=this.$a.attr("data-id");this.visible=false;this.visibleBefore=false;this.expanded=false;this.subfolders=[];this.fm.folders[this.id]=this;this.folderName=this.$a.text().replace(/\s+$/,"").replace(/^\s+/,"");if(this.depth==1){this.onShow()}var d=[];if(this.fm.settings.mode=="full"&&this.depth>1){d.push({label:Craft.t("Rename folder"),onClick:$.proxy(this,"_rename")})}d.push({label:Craft.t("New subfolder"),onClick:$.proxy(this,"_createSubfolder")});if(this.fm.settings.mode=="full"&&this.depth>1){d.push({label:Craft.t("Delete folder"),onClick:$.proxy(this,"_delete")})}new Garnish.ContextMenu(this.$a,d,{menuClass:"menu assets-contextmenu"})},hasSubfolders:function(){return this.$li.find("ul li").length>0},_prepForSubfolders:function(){if(!this.$toggle){this.$toggle=$('<div class="toggle"></div>')}this.$toggle.insertAfter(this.$a);this.addListener(this.$toggle,"mouseup,mousedown,click",function(a){a.stopPropagation()});this.removeListener(this.$toggle,"click");this.addListener(this.$toggle,"click",function(a){a.stopPropagation();this._toggle()});if(!this.$ul){if(this.$li.children().filter("ul").length==0){this.$li.append("<ul></ul>")}this.$ul=this.$li.children().filter("ul")}this.$ul.appendTo(this.$li)},_unprepForSubfolders:function(){this.$toggle.remove();this.$ul.remove();this.collapse()},addSubfolder:function(d){if(!this.hasSubfolders()){this._prepForSubfolders();var e=0}else{var c=[{name:d.folderName,id:d.id}];for(var b=0;b<this.subfolders.length;b++){c.push({name:this.subfolders[b].folderName,id:this.subfolders[b].id})}c.sort(Assets.FileManagerFolder.folderSort);for(b=0;b<c.length;b++){if(c[b].name==d.folderName){e=b;break}}}if(e==0){d.$li.prependTo(this.$ul);this.$ul.prepend(d.$li)}else{var a=this.fm.folders[c[e-1].id];d.$li.insertAfter(a.$li)}this.subfolders.push(d)},removeSubfolder:function(a){this.subfolders.splice($.inArray(a,this.subfolders),1);if(!this.hasSubfolders()){this._unprepForSubfolders()}},_toggle:function(){if(this.expanded){this.collapse()}else{this.expand()}},expand:function(){if(this.expanded){return}this.expanded=true;this.$a.parent().addClass("expanded");this.$ul.show();this._onShowSubfolders();this.fm.setFolderState(this.id,"expanded")},collapse:function(){if(!this.expanded){return}this.expanded=false;this.$a.parent().removeClass("expanded");this.$ul.hide();this._onHideSubfolders();this.fm.setFolderState(this.id,"collapsed")},onShow:function(){this.visible=true;this.fm.folderSelect.addItems(this.$a);if(this.depth>1){if(this.fm.settings.mode=="full"){this.fm.folderDrag.addItems(this.$li)}}if(!this.visibleBefore){this.visibleBefore=true;if(this.hasSubfolders()){this._prepForSubfolders();var b=this.$ul.children().filter("li");for(var a=0;a<b.length;a++){var c=new Assets.FileManagerFolder(this.fm,b[a],this.depth+1,this);this.subfolders.push(c)}}}if(this.expanded){this._onShowSubfolders()}},onHide:function(){this.visible=false;this.fm.folderSelect.removeItems(this.$a);if(this.expanded){this._onHideSubfolders()}},_onShowSubfolders:function(){for(var a in this.subfolders){this.subfolders[a].onShow()}},_onHideSubfolders:function(){for(var a in this.subfolders){this.subfolders[a].onHide()}},onDelete:function(b){delete this.fm.folders[this.id];if(b){this.parent.removeSubfolder(this);this.$li.remove()}for(var a=0;a<this.subfolders.length;a++){this.subfolders[a].onDelete()}if(!this.parent.hasSubfolders()){this.parent._unprepForSubfolders()}if(this.fm.folderSelect.isSelected(this.$a)){this.parent.select();this.deselect()}},deselect:function(){this.fm.folderSelect.deselectItem(this.$a)},select:function(){this.fm.folderSelect.selectItem(this.$a)},moveTo:function(a){var b=this.fm.folders[a];if(b==this.parent){return}b.addSubfolder(this);this.parent.removeSubfolder(this);b.expand();this.parent=b;this.depth=this.parent.depth+1},updateId:function(e){delete this.fm.folders[this.id];var a=this.fm.selectedFolderIds.indexOf(this.id);if(a!=-1){this.fm.selectedFolderIds[a]=path}this.id=e;this.$a.attr("data-id",this.id);this.fm.folders[this.id]=this;for(var c=0;c<this.subfolders.length;c++){var d=this.subfolders[c],b=this.id+d.id+"/";d.updateId(b)}},updateName:function(a){$("span.assets-folder-label",this.$a).html(a);var d=[{name:a,id:this.id}];for(var c=0;c<this.parent.subfolders.length;c++){if(this.parent.subfolders[c].folderName!=this.folderName){d.push({name:this.parent.subfolders[c].folderName,id:this.parent.subfolders[c].id})}}d.sort(Assets.FileManagerFolder.folderSort);for(c=0;c<d.length;c++){if(d[c].name==a){pos=c;break}}if(pos==0){this.$li.prependTo(this.parent.$ul)}else{var b=this.fm.folders[d[pos-1].id];this.$li.insertAfter(b.$li)}this.folderName=a},_rename:function(){var b=this.folderName,a=prompt(Craft.t("Rename folder"),b);if(a&&a!=b){var c={folderId:this.id,newName:a};this.fm.setAssetsBusy();Craft.postActionRequest("assets/renameFolder",c,$.proxy(function(d){this.fm.setAssetsAvailable();if(d.success){this.updateName(d.newName)}if(d.error){alert(d.error)}},this),"json")}},_createSubfolder:function(){var a=prompt(Craft.t("Enter the name of the folder"));if(a){var b={parentId:this.id,folderName:a};this.fm.setAssetsBusy();Craft.postActionRequest("assets/createFolder",b,$.proxy(function(f){this.fm.setAssetsAvailable();if(f.success){var c=this.depth+1,d=f.folderName,g=$('<li class="assets-fm-folder"><a data-id="'+f.folderId+'">'+f.folderName+"</a></li>"),e=new Assets.FileManagerFolder(this.fm,g[0],c,this);this.addSubfolder(e);this.expand();e.onShow()}if(f.error){alert(f.error)}},this))}},_delete:function(){if(confirm(Craft.t("Really delete folder “{folder}”?",{folder:this.folderName}))){var a={folderId:this.id};this.fm.setAssetsBusy();Craft.postActionRequest("assets/deleteFolder",a,$.proxy(function(b){this.fm.setAssetsAvailable();if(b.success){this.onDelete(true)}if(b.error){alert(b.error)}},this))}}},{folderSort:function(d,c){d=d.name.toLowerCase();c=c.name.toLowerCase();return d<c?-1:(d>c?1:0)}});